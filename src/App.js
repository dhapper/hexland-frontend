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

// const socket = io("http://localhost:4000");
// const socket = io("https://hexland-backend.onrender.com");
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

  const myResources = gameState.players?.[playerId]?.resources || {};
  const myPorts = (gameState.ports || []).filter(port =>
    port.owner.includes(playerId)
  );
  const playerActionDisplayTime = gameState.phase === Phase.IN_GAME && gameState.turnPhase === TurnPhase.ACTION && isMyTurn && !gameState.robber?.mustBePlaced;

  const [inTradingInterface, setInTradingInterface] = useState(false);

  const [boardScale, setBoardScale] = useState(0.8); // default

  // const [buildMode, setBuildMode] = useState(null); // "house", "road", etc.
  const [buildIntent, setBuildIntent] = useState(null);
  // const buildMode = (() => {
  //   // SETUP
  //   if (gameState.phase === Phase.SETUP) {
  //     return gameState.setupStep; // "house" or "road"
  //   }

  //   // DEV CARD: Road Building
  //   if (gameState.turnPhase === DevCard.ROAD_BUILDING) {
  //     return BuildTypes.ROAD;
  //   }

  //   // NORMAL ACTION PHASE
  //   if (gameState.turnPhase === TurnPhase.ACTION && isMyTurn) {
  //     return null; // player chooses via UI buttons
  //   }

  //   return null;
  // })();
  // const effectiveBuildMode =
  // gameState.turnPhase === DevCard.ROAD_BUILDING
  //   ? BuildTypes.ROAD
  //   : buildIntent;
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

  // useEffect(() => {
  //   if (gameState.turnPhase === DevCard.ROAD_BUILDING) {
  //     setBuildMode(BuildTypes.ROAD);
  //   } else {
  //     // setBuildMode(null);
  //   }
  // }, [gameState.turnPhase]);

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


  return (
    <div style={{ background: "#524f4f", height: "100vh" }}>

      <div style={{ display: 'flex', height: '100vh' }}>
        <div style={{ flex: 1, maxWidth: '25%', borderRight: `4px solid ${theme.colors.lightAccent}` }}>

          {/* ===== LEFT PANEL ===== */}

          {isLobby === false && isHost && (
            <button onClick={() => socket.emit("exitToLobby")}>
              Exit to Lobby
            </button>
          )}

          <div>{gameState.turnPhase}</div>
          <div>hi{String(gameState.devCardRoadBuildingFirstRoadPlaced)}</div>
          <div>{buildMode}</div>

          {/* <div style={{ marginTop: "10px" }}>
            <strong>My Cards</strong>

            {!gameState.players?.[playerId] ? (
              <div style={{ fontSize: 12, opacity: 0.7 }}>
                Player not found
              </div>
            ) : (
              <>
                {(!gameState.players[playerId].actionCards || Object.keys(gameState.players[playerId].actionCards).length === 0) && (
                  <div style={{ fontSize: 12, opacity: 0.7 }}>
                    No cards
                  </div>
                )}

                {gameState.players[playerId].actionCards && Object.entries(gameState.players[playerId].actionCards).map(([card, count]) => (
                  <div key={card}>
                    {card.toUpperCase()} × {count}
                  </div>
                ))}

                {gameState.players[playerId].devCardsBoughtThisTurn &&
                  Object.entries(gameState.players[playerId].devCardsBoughtThisTurn).map(([card, count]) => (
                    <div key={card}>
                      {card.toUpperCase()} × {count}
                    </div>
                  ))}
              </>
            )}
          </div> */}

          {/* <div>
            {gameState.players[playerId].actionCards}
          </div> */}

          {/* ===== ROBBER DEBUG ===== */}
          {/* {gameState.robber && (
            <div
              style={{
                marginTop: 12,
                padding: 8,
                border: "2px dashed hotpink",
                borderRadius: 6,
                background: "#1e1e1e",
                color: "#fff",
                fontSize: 12,
              }}
            >
              <strong>Robber State</strong>

              <div>tileId: {gameState.robber.tileId ?? "none"}</div>
              <div>mustBePlaced: {String(gameState.robber.mustBePlaced)}</div>
              <div>fromRolling: {String(gameState.robber.fromRolling)}</div>

              <div>
                mustDiscard:
                <pre style={{ margin: 0 }}>
                  {JSON.stringify(gameState.robber.mustDiscard || {}, null, 2)}
                </pre>
              </div>

              <div>
                playersToStealFrom:
                <pre style={{ margin: 0 }}>
                  {JSON.stringify(gameState.robber.playersToStealFrom || [], null, 2)}
                </pre>
              </div>

              <p>{gameState.robber?.mustDiscard?.[playerId]?.satisfied ? "true" : "false"}</p>
              <p>{gameState.robber?.mustDiscard?.[playerId]?.required}</p>

            </div>
          )} */}

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
          ></GameInfo>

          {/* {gameState.phase === Phase.IN_GAME && gameState.turnPhase === TurnPhase.ACTION && isMyTurn && !gameState.robber?.mustBePlaced && ( */}
          {playerActionDisplayTime && (
            <PlayerAction
              // roadAction={() => setBuildMode(buildMode === BuildTypes.ROAD ? null : BuildTypes.ROAD)}
              // houseAction={() => setBuildMode(buildMode === BuildTypes.HOUSE ? null : BuildTypes.HOUSE)}
              // cityAction={() => setBuildMode(buildMode === BuildTypes.CITY ? null : BuildTypes.CITY)}
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
            />
          )}

          {gameState.phase === Phase.IN_GAME && (
            <PlayerInventory
              resources={myResources}
              ports={myPorts}
              myPlayerId={playerId}
              myCards={gameState.players[playerId].actionCards}
              cardsBoughtThisTurn={gameState.players[playerId].devCardsBoughtThisTurn || {}}
              canPlayCard={!gameState.players[playerId].playedDevCardThisTurn && playerActionDisplayTime}
              playDevCard={(cardName) => socket.emit("playDevCard", cardName, playerId)}
            ></PlayerInventory>
          )}

        </div>
        <div
          ref={boardRef}
          style={{ flex: 2, maxWidth: '60%', overflow: 'hidden', backgroundColor: "#212063" }}
        >

          {/* ===== CENTRE PANEL ===== */}

          <div
            style={{
              position: "relative",
              ...(debug && { border: "4px solid red" }),
            }}
          >
            {/* HexBoard stays in the normal flow */}
            <HexBoard
              boardLayout={gameState.boardLayout || []}
              tiles={gameState.tiles || []}
              vertices={gameState.vertices || []}
              edges={gameState.edges || []}
              ports={gameState.ports || []}
              players={gameState.players || {}}
              currentPlayerId={gameState.turn}
              myPlayerId={playerId}
              // onPlaceHouse={(vertexKey) => {
              //   console.log("Emitting placeHouse to backend:", vertexKey);
              //   socket.emit("placeHouse", { vertexKey });
              //   // setBuildMode(null);
              // }}
              // onPlaceRoad={(edgeKey) => {
              //   console.log("Emitting placeRoad to backend:", edgeKey);
              //   socket.emit("placeRoad", { edgeKey });
              //   // setBuildMode(gameState.devCardRoadBuildingFirstRoadPlaced ? BuildTypes.ROAD : null);
              // }}
              // onPlaceCity={(vertexKey) => {
              //   console.log("Emitting placeCity to backend:", vertexKey);
              //   socket.emit("placeCity", { vertexKey });
              //   // setBuildMode(null);
              // }}
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

              // onPlaceRoad={(edgeKey) => {
              //   socket.emit("placeRoad", { edgeKey });
              //   if (gameState.turnPhase === TurnPhase.ACTION) {
              //     setBuildIntent(null);
              //   }
              // }}
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
              }
              }
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
                />
              </div>
            )}

            {gameState.robber?.step === "discarding" &&
              // gameState.robber.mustDiscard?.[playerId] &&
              // !gameState.robber.mustDiscard[playerId]?.satisfied &&
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
                      // submitDiscard
                      // socket.emit("bankTrade", { offerList: offerList, wantList: wantList });
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
          </div>
        </div>

        <div style={{ flex: 2, maxWidth: '15%' }}>

          {/* ===== RIGHT PANEL ===== */}

          <p>right container</p>
          <p>Dummy Logs</p>
          <p>Turn X: Colour/Name</p>
          <p>roll: 3 + 2 = 5</p>
          <p>trade:</p>
          <p>red -{'>'} 2 wood</p>
          <p>1 ore {'<'}- green</p>
          <p>action: built a house</p>
          <p>action: built a road</p>
          <p>action: built a road</p>
          <p><strong>achieved longest road.</strong></p>
          <p>trade:</p>
          <p>red -{'>'} 4 wood</p>
          <p>1 ore {'<'}- Bank</p>
          <p>action: built a city</p>
          <p>{gameState.turn}</p>

          <div>
            <h3>Board Scale</h3>
            <input
              type="range"
              min="0.5"
              max="1.5"
              step="0.01"
              value={boardScale}
              onChange={(e) => setBoardScale(parseFloat(e.target.value))}
            />
            <p>{Math.round(boardScale * 100)}%</p>
          </div>
        </div>
      </div>

    </div >
  );
}

export default App;
