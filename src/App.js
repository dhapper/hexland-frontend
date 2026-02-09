import React, { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import { BuildTypes, Phase, TurnPhase, Resource, DevCard } from "./utils/constants";
import HexBoard from "./components/HexBoard";
import GameInfo from "./ui/GameInfo";
import PlayerInventory from "./ui/PlayerInventory";
import TradingInterface from "./ui/TradingInterface";
import CurrentTrade from "./ui/CurrentTrade";
import PlayerAction from "./ui/PlayerAction";
import SetupPanel from "./ui/SetupPanel";
import LobbyPanel from "./ui/LobbyPanel";
import theme from "./ui/theme";
import DiscardInterface from "./ui/DiscardInterface";
import ChooseStealPlayer from "./ui/ChooseStealPlayer";
import MonopolyInterface from "./ui/MonopolyInterface";
import InventionInterface from "./ui/InventionInterface";
import { ReactComponent as BackgroundSVG } from "./assets/icons/waves.svg";
import { canAfford } from "./utils/calculator";
import { Costs, BuildToCost } from "./utils/constants";
import GameOverPopUp from "./ui/GameOverPopUp";
import boardBg from './assets/waterbg3.jpeg';
import { PLAYER_UI_COLORS } from "./utils/playerUIColorMap";
import { BOARD, BOARD_LAYOUT, EDGES, PORTS, TILES, VERTICES } from "./utils/offlineBoardInput";


const socket = io(process.env.REACT_APP_BACKEND_URL);

const debug = false;

console.log("Backend URL:", process.env.REACT_APP_BACKEND_URL);

function App() {
  const [gameState, setGameState] = useState({
    players: {},
    turn: null,
    phase: Phase.LOBBY,
    hostId: null
  });

  const [playerId, setPlayerId] = useState(null);

  const myId = playerId; // 👈 single source of truth
  const isHost = gameState.hostId === myId;
  const isLobby = gameState.phase === Phase.LOBBY;
  const isMyTurn = playerId === gameState.turn;
  const isMyPairedTurn = playerId === gameState.pairedPlayerId;
  const isGameOver = gameState.gameOver;
  const myPlayer = gameState.players[playerId];

  const myResources = gameState.players?.[playerId]?.resources || {};
  const myPorts = (gameState.ports || []).filter(port =>
    port.owner.includes(playerId)
  );
  const playerActionDisplayTime = gameState.phase === Phase.IN_GAME && gameState.turnPhase === TurnPhase.ACTION && isMyTurn && !gameState.robber?.mustBePlaced;
  const pairedPlayerActionDisplayTime = gameState.phase === Phase.IN_GAME && gameState.turnPhase === TurnPhase.PAIRED_PLAYER_ACTION && isMyPairedTurn && !gameState.robber?.mustBePlaced;

  // const [pan, setPan] = React.useState({ x: 0, y: 0 });

  const [inTradingInterface, setInTradingInterface] = useState(false);

  const [boardScale, setBoardScale] = useState(0.8); // default

  const [buildIntent, setBuildIntent] = useState(null);

  const buildMode = (() => {
    // 1️⃣ SETUP phase forces build type
    if (gameState.phase === Phase.SETUP) {
      return gameState.setupStep; // HOUSE or ROAD
    }

    // 2️⃣ Road Building dev card forces ROAD
    if (gameState.turnPhase === DevCard.ROAD_BUILDING) {
      return BuildTypes.ROAD;
    }

    // 3️⃣ Normal action phase = player's choice
    if (gameState.turnPhase === TurnPhase.ACTION && isMyTurn) {
      return buildIntent;
    }

    // paired player
    if (gameState.turnPhase === TurnPhase.PAIRED_PLAYER_ACTION && isMyPairedTurn) {
      return buildIntent;
    }

    // 4️⃣ Everything else = no building
    return null;
  })();



  const boardRef = useRef(null);


  // 1️⃣ Persistent ID setup
  useEffect(() => {
    let savedId = localStorage.getItem("playerId");
    if (!savedId) {
      savedId = `player_${Math.floor(Math.random() * 100000)}`;
      localStorage.setItem("playerId", savedId);
    }
    setPlayerId(savedId);
    socket.emit("registerPlayer", savedId);
  }, []);

  // 2️⃣ Game state listener
  useEffect(() => {
    const handleGameState = (stateFromServer) => {
      console.log("Received game state from backend", stateFromServer);
      setGameState(stateFromServer);
    };

    socket.on("gameState", handleGameState);

    return () => {
      socket.off("gameState", handleGameState);
    };
  }, []);

  // for wheel listener
  useEffect(() => {
    if (!boardRef.current) return;

    const handleWheel = (e) => {
      e.preventDefault(); // ✅ prevent page scroll
      const delta = -e.deltaY * 0.001; // tweak sensitivity
      setBoardScale((prev) => {
        let next = prev + delta;
        if (next < 0.5) next = 0.5; // min zoom
        if (next > 1.5) next = 1.5; // max zoom
        return next;
      });
    };

    const boardEl = boardRef.current;
    boardEl.addEventListener("wheel", handleWheel, { passive: false });

    // Cleanup
    return () => {
      boardEl.removeEventListener("wheel", handleWheel);
    };
  }, [boardRef]);


  // For turn log auto scroll
  const bottomRef = useRef(null);
  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth", // or "auto"
    });
  }, [gameState.turnLogs]);





  const [connected, setConnected] = useState(false);

  useEffect(() => {
    socket.on("connect", () => setConnected(true));
    socket.on("disconnect", () => setConnected(false));

    return () => {
      socket.off("connect");
      socket.off("disconnect");
    };
  }, []);




  return (
    <div style={{ background: "#524f4f", height: "100vh" }}>

      <div style={{ display: 'flex', height: '100vh' }}>
        <div
          style={{
            flex: 1,
            maxWidth: "20%",
            borderRight: `4px solid ${theme.colors.lightAccent}`,
            background: theme.colors.panelBackground,

            display: "flex",
            flexDirection: "column",

            height: "100vh",
            overflowY: "auto",   // 👈 THIS is the key
          }}
        >
          {/* {connected && (
            <div style={{ color: "white "}} >is connected</div>
          )}
          {!connected && (
            <div style={{ color: "white "}} >no connect?</div>
          )} */}


          {/* ===== LEFT PANEL ===== */}

          {gameState.phase === Phase.LOBBY && (
            <LobbyPanel
              isHost={isHost}
              changeColor={() => socket.emit("changeColor")}
              startGame={() => socket.emit("startGame")}
              rerollBoard={() => socket.emit("rerollBoard")}
              resetGame={() => socket.emit("resetGame")}

              players={gameState.players}
              myPlayerId={playerId}
              hostId={gameState.hostId}

              onSubmitName={(displayName) => socket.emit("setDisplayName", playerId, displayName)}
              availableColors={gameState.availableColors}
              onSetColor={(color) => socket.emit("setColor", playerId, color)}
              onSetBoardLayout={(boardLayout) => socket.emit("setBoardLayout", boardLayout)}
              onSetAllBankResources={(quantity) => socket.emit("setAllBankResources", quantity)}
              onEnabledPairedPlayer={(enabled) => socket.emit("setEnabledPairedPlayer", enabled)}
              onSetDevCards={(useExpansion) => socket.emit("setDevCards", useExpansion)}
              onSetRobberMax={(robberMaxCards) => socket.emit("setRobberMaxCards", robberMaxCards)}
              robberMaxCardsValue={gameState.robberMaxCards}
              onSetVictoryPointsNeeded={(victoryPointsNeeded) => socket.emit("setVictoryPointsNeeded", victoryPointsNeeded)}
              victoryPointsNeededValue={gameState.victoryPointsNeeded}
              disconnectEveryone={() => socket.emit("disconnectAllPlayers")}

              connected={connected}
            />
          )}

          {(gameState.phase === Phase.ROLL_FOR_TURN_ORDER) && (
            <SetupPanel
              turnOrder={gameState.turnOrder || []}
              players={gameState.players || {}}
              currentPlayerId={gameState.turn}
              myPlayerId={playerId}
              hostId={gameState.hostId}

              phase={gameState.phase}
              turnOrderRolls={gameState.turnOrderRolls}
              turnOrderRollFunction={() => socket.emit(Phase.ROLL_FOR_TURN_ORDER)}
              lastRolls={gameState.lastRolls}
            />
          )}

          {connected && (
            <GameInfo
              turnOrder={gameState.turnOrder || []}
              players={gameState.players || {}}
              currentPlayerId={gameState.turn}
              myPlayerId={playerId}
              hostId={gameState.hostId}
              lastRoll={gameState.lastRoll || {}}
              bankResources={gameState.bankResources}
              rollTime={gameState.phase === Phase.IN_GAME && gameState.turnPhase === TurnPhase.ROLL && isMyTurn}
              rollDice={() => socket.emit("rollDice")}
              phase={gameState.phase}
              turnPhase={gameState.turnPhase}
              pairedPlayerId={gameState.pairedPlayerId}
              onExitToLobby={() => socket.emit("exitToLobby")}
              isHost={isHost}
            ></GameInfo>
          )}

          {/* {gameState.phase === Phase.IN_GAME && gameState.turnPhase === TurnPhase.ACTION && isMyTurn && !gameState.robber?.mustBePlaced && ( */}
          {(playerActionDisplayTime || pairedPlayerActionDisplayTime) && (
            <PlayerAction
              roadAction={() => setBuildIntent(BuildTypes.ROAD)}
              houseAction={() => setBuildIntent(BuildTypes.HOUSE)}
              cityAction={() => setBuildIntent(BuildTypes.CITY)}
              tradeAction={() => setInTradingInterface(inTradingInterface ? false : true)}
              endTurnAction={() => {
                setBuildIntent(null);
                socket.emit("endTurn")
              }}
              isHost={isHost}
              exitLobbyAction={() => socket.emit("exitToLobby")}
              buildCard={() => socket.emit("drawDevCard", playerId)}
              // confirmTrade={(id) => socket.emit("acceptTrade", { tradingPlayerId: id })}
              canAffordRoad={canAfford(Costs[BuildToCost.road], myPlayer?.resources)}
              canAffordHouse={canAfford(Costs[BuildToCost.house], myPlayer?.resources)}
              canAffordCity={canAfford(Costs[BuildToCost.city], myPlayer?.resources)}
              canAffordDevCard={canAfford(Costs[BuildToCost.devCard], myPlayer?.resources)}
              isMyPairedTurn={isMyPairedTurn}
            />
          )}

          {gameState.phase === Phase.IN_GAME && (
            <PlayerInventory
              resources={myResources}
              ports={myPorts}
              myPlayerId={playerId}
              myCards={gameState.players[playerId].actionCards}
              cardsBoughtThisTurn={gameState.players[playerId].devCardsBoughtThisTurn || {}}
              canPlayCard={!gameState.players[playerId].playedDevCardThisTurn && (playerActionDisplayTime || pairedPlayerActionDisplayTime)}
              playDevCard={(cardName) => socket.emit("playDevCard", cardName, playerId)}
              hasLongestRoad={gameState.longestRoad?.playerId === playerId}
              hasLargestArmy={gameState.largestArmy?.playerId === playerId}
            ></PlayerInventory>
          )}

        </div>
        <div
          ref={boardRef}
          style={{
            flex: 2,
            maxWidth: connected ? '60%' : '80%',
            overflow: 'hidden',
            backgroundColor: "#212063",
            backgroundImage: `url(${boardBg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        >

          {/* ===== CENTRE PANEL ===== */}

          <div
            style={{
              position: "relative",
              ...(debug && { border: "4px solid red" }),
            }}
          >
            {/* HexBoard stays in the normal flow */}
            {/* <div style={{ position: "relative", zIndex: 1 }}> */}

            {!connected && (
              <HexBoard
                boardLayout={BOARD_LAYOUT}
                tiles={TILES}
                vertices={VERTICES}
                edges={EDGES}
                ports={PORTS}
                scale={0.6}
                gameState={{
                  phase: Phase.LOBBY,
                  turn: null,
                  setupStep: null,
                  players: {},
                  devCardRoadBuildingFirstRoadPlaced: false,
                }}
                buildMode={null}
                myPlayerId={null}
              />
            )}

            <HexBoard
              boardLayout={gameState.boardLayout || []}
              // boardLayout={BOARD_LAYOUT}
              tiles={gameState.tiles || []}
              vertices={gameState.vertices || []}
              edges={gameState.edges || []}
              ports={gameState.ports || []}
              players={gameState.players || {}}
              currentPlayerId={gameState.turn}
              myPlayerId={playerId}
              onPlaceRoad={(edgeKey) => {
                // Only allow if buildIntent is ROAD (prevents extra clicks)
                if (buildIntent !== BuildTypes.ROAD && gameState.turnPhase === TurnPhase.ACTION) return;

                socket.emit("placeRoad", { edgeKey });

                if (gameState.turnPhase === DevCard.ROAD_BUILDING) {
                  // First road placed, allow second
                  if (!gameState.devCardRoadBuildingFirstRoadPlaced) {
                    setBuildIntent(BuildTypes.ROAD); // still ROAD
                  } else {
                    setBuildIntent(null); // second road done
                  }
                } else if (gameState.turnPhase === TurnPhase.ACTION) {
                  // Normal turn, always reset after one
                  setBuildIntent(null);
                }
              }}
              onPlaceHouse={(vertexKey) => {
                socket.emit("placeHouse", { vertexKey });
                if (gameState.turnPhase === TurnPhase.ACTION) {
                  setBuildIntent(null);
                }
              }}
              onPlaceCity={(vertexKey) => {
                socket.emit("placeCity", { vertexKey });
                if (gameState.turnPhase === TurnPhase.ACTION) {
                  setBuildIntent(null);
                }
              }}

              scale={boardScale}
              gameState={gameState}
              socket={socket}
              buildMode={buildMode}
              robber={gameState.robber}
              placeRobber={(id) => {
                console.log("pressed")
                socket.emit("placeRobber", { tileId: id })
              }}
              isMyPairedTurn={isMyPairedTurn}
              // pan={pan}
              // setPan={setPan}
              // resetPan={resetPan}
              debug={debug}
            />

            {/* Centered TradingInterface overlay */}
            {inTradingInterface && (
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "rgba(0,0,0,0.3)",
                  zIndex: 10,
                }}
              >
                <TradingInterface
                  resources={myResources}
                  ports={myPorts}
                  myPlayerId={playerId}
                  onPlayerTrade={(offerList, wantList) => {
                    console.log("Player Trade Clicked:", offerList, wantList); // debug
                    socket.emit("offerTrade", { offerList, wantList });
                  }}
                  onBankTrade={(offerList, wantList) => {
                    console.log("Bank Trade Clicked:", offerList, wantList); // debug
                    socket.emit("bankTrade", { offerList: offerList, wantList: wantList });
                  }}
                  closeInterface={() => setInTradingInterface(false)}
                  isMyPairedTurn={isMyPairedTurn}
                />
              </div>
            )}

            {gameState.robber?.step === "discarding" &&
              (
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "rgba(0,0,0,0.3)",
                    zIndex: 10,
                  }}
                >
                  <DiscardInterface
                    resources={myResources}
                    discardCount={gameState.robber?.mustDiscard?.[playerId]?.required}
                    onSubmitDiscard={(discardList) => {
                      console.log("(app.js) discardList:", discardList); // debug
                      socket.emit("submitDiscard", { discardList: discardList });
                    }}


                    robber={gameState.robber}
                    myPlayerId={playerId}
                    satisfied={gameState.robber?.mustDiscard?.[playerId]?.satisfied || !gameState.robber?.mustDiscard?.[playerId]}
                  />
                </div>
              )}

            {gameState.currentTradeOffer?.active && (
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "rgba(0,0,0,0.3)",
                  zIndex: 10,
                }}
              >
                <CurrentTrade
                  myPlayerId={playerId}
                  players={gameState.players}
                  currentTrade={gameState.currentTradeOffer}
                  resources={myResources}
                  closeTrade={() => socket.emit("closeTrade")}
                  confirmTrade={(id) => socket.emit("acceptTrade", { tradingPlayerId: id })}
                  onAccept={() => socket.emit("tradeAction", { acceptOffer: true })}
                  onDecline={() => socket.emit("tradeAction", { acceptOffer: false })}
                />
              </div>
            )}

            {gameState.robber?.step === "stealing" &&
              gameState.robber?.placingPlayer === playerId &&
              gameState.robber.playersToStealFrom?.length > 0 && (
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "rgba(0,0,0,0.3)",
                    zIndex: 10,
                  }}
                >
                  <ChooseStealPlayer
                    players={gameState.players}
                    playersToStealFrom={gameState.robber?.playersToStealFrom}
                    onSelectPlayer={(id) => {
                      console.log("app.js log for victimId: ", id)
                      socket.emit("stealRandomResource", { victimId: id })
                    }}
                  />
                </div>
              )}

            {gameState.turnPhase == DevCard.MONOPOLY && isMyTurn && (
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "rgba(0,0,0,0.3)",
                  zIndex: 10,
                }}
              >
                <MonopolyInterface
                  onClose={() => socket.emit("setTurnPhase", TurnPhase.ACTION)}
                  monopolizeResource={(resource) => {
                    socket.emit("monopolizeResource", playerId, resource)
                  }}
                />
              </div>
            )}

            {gameState.turnPhase == DevCard.INVENTION && isMyTurn && (
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "rgba(0,0,0,0.3)",
                  zIndex: 10,
                }}
              >
                <InventionInterface
                  onClose={() => socket.emit("setTurnPhase", TurnPhase.ACTION)}
                  bankResources={gameState.bankResources}
                  onSubmitInvention={(wantList) => {
                    socket.emit("invention", playerId, wantList)
                  }}
                />
              </div>
            )}

            {isGameOver && (
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "rgba(0,0,0,0.3)",
                  zIndex: 10,
                }}
              >
                <GameOverPopUp
                  winnerDisplayName={gameState.players[gameState.winnerId].displayName}
                  isHost={isHost}
                  onBackToLobby={() => {
                    socket.emit("exitToLobby")
                    socket.emit("resetGame")
                  }}
                />
              </div>
            )}
          </div>
        </div>

        {connected && (
          <div
            style={{
              flex: 2,
              maxWidth: "20%",
              borderLeft: `4px solid ${theme.colors.lightAccent}`,
              background: theme.colors.panelBackground,

              display: "flex",
              flexDirection: "column",
              height: "100vh",
            }}
          >
            {/* ===== RIGHT PANEL ===== */}

            <div
              style={{
                flex: 1,             // takes remaining space
                overflowY: "auto",   // scrolls if content is tall
                paddingRight: 4,
                border: `${theme.styling.defaultBorder} ${theme.colors.lightAccent}`,
                borderRadius: theme.styling.defaultRadius,
                padding: theme.styling.componentPadding,
                margin: theme.styling.componentMargin,
                backgroundColor: theme.colors.componentBackground,
              }}
            >
              {gameState.turnLogs?.map((turn) => (
                <div style={{
                  border: `${theme.styling.defaultBorder} ${theme.colors.lightAccent}`,
                  borderRadius: theme.styling.defaultRadius,
                  padding: theme.styling.componentPadding,
                  margin: theme.styling.componentMargin,

                  background: PLAYER_UI_COLORS[gameState.players[turn.playerId].color].bgColor,
                  borderColor: PLAYER_UI_COLORS[gameState.players[turn.playerId].color].borderColor,

                }}>
                  {/* Top row: Turn number (left) and Roll (right) */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      fontSize: "18px", // same font size for turn + roll
                      fontWeight: "500",
                      marginBottom: "4px", // small gap to player name below
                    }}
                  >
                    <span>Turn {turn.turn}</span>
                    {turn.roll && <span>Roll: {turn.roll}</span>}
                  </div>

                  {/* Player name below */}
                  <div
                    style={{
                      fontSize: "22px", // slightly larger
                      fontWeight: "600",
                    }}
                  >
                    {turn.displayName}
                  </div>

                  {/* Display all actions */}
                  <div
                    style={{
                      // paddingLeft: "16px",
                      // marginTop: "4px",
                      whiteSpace: "pre-wrap",
                      wordBreak: "break-word",
                    }}
                  >
                    {turn.actions && turn.actions.length > 0 && (
                      <div style={{ marginTop: 4 }}>
                        {/* <strong>Actions:</strong> */}
                        <div style={{ paddingLeft: "16px", marginTop: "4px" }}>
                          {turn.actions.map((action, i) => (
                            <div key={i}>{action}</div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>


                </div>
                // </li>
              ))}

              {/* 👇 invisible anchor */}
              <div ref={bottomRef} />
              {/* </div> */}
              {/* </ul> */}
            </div>
            <div
              style={{
                color: theme.colors.lightAccent,
                paddingRight: 4,
                border: `${theme.styling.defaultBorder} ${theme.colors.lightAccent}`,
                borderRadius: theme.styling.defaultRadius,
                margin: theme.styling.componentMargin,
                backgroundColor: theme.colors.componentBackground,

                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
              }}
            >
              <h3>Board Scale: {Math.round(boardScale * 100)}%</h3>
              <input
                type="range"
                min="0.5"
                max="1.5"
                step="0.01"
                value={boardScale}
                onChange={(e) => setBoardScale(parseFloat(e.target.value))}
              />
              <div style={{ marginBottom: "10px" }}>{Math.round(boardScale * 100)}%</div>

              {/* <button
              onClick={() => {
                setPan({ x: 0, y: 0 });
                // 👇 THIS IS THE CRITICAL PART
                // tell inertia to stop pulling back
                if (boardRef.current?.resetTargetPan) {
                  boardRef.current.resetTargetPan();
                }
              }}
            >
              Center Board
            </button> */}

            </div>

          </div>

        )}

      </div>

    </div >
  );
}

export default App;
