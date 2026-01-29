import React, { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import { BuildTypes, Phase, TurnPhase, Resource } from "./utils/constants";
import HexBoard from "./components/HexBoard";
import GameInfo from "./ui/GameInfo";
import PlayerInventory from "./ui/PlayerInventory";

// const socket = io("http://localhost:4000");
// const socket = io("https://hexland-backend.onrender.com");
const socket = io(process.env.REACT_APP_BACKEND_URL);

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

  const myResources = gameState.players?.[playerId]?.resources || {};
  const myPorts = (gameState.ports || []).filter(port =>
    port.owner.includes(playerId)
  );



  const [boardScale, setBoardScale] = useState(0.8); // default

  const [buildMode, setBuildMode] = useState(null); // "house", "road", etc.

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



  const isMyTurn = playerId === gameState.turn;


  return (
    <div style={{ background: "#524f4f", height: "100vh" }}>

      {/* <p> hi </p>
      <p>{ gameState.boardLayout }</p>
      <p>{ JSON.stringify(gameState.tiles) }</p> */}

      <div style={{ display: 'flex', height: '100vh' }}>
        <div style={{ flex: 1, maxWidth: '25%' }}>
          <p>left container</p>

          <h1>Player Sync Test</h1>
          <p>
            <strong>Backend URL:</strong>{" "}
            {process.env.REACT_APP_BACKEND_URL}
          </p>
          <p>
            <strong>Phase:</strong>{" "}
            {gameState.phase}
          </p>
          <p>
            <strong>Turn Phase:</strong>{" "}
            {gameState.turnPhase}
          </p>

          {isLobby && (
            <div>
              {Object.entries(gameState.players).map(([id, player]) => (
                <div
                  key={id}
                  style={{
                    margin: 5,
                    padding: 10,
                    backgroundColor: player.color,
                    color: "#fff",
                  }}
                >
                  {id} {id === playerId ? "(You)" : ""}{" "}
                  {gameState.turn === id ? "(Current Turn)" : ""}
                </div>
              ))}
            </div>
          )}

          <div>
            <h3>Turn Order:</h3>
            {(gameState.turnOrder || []).map((id, index) => {
              const player = gameState.players[id];
              if (!player) return null; // safety check for disconnected players

              return (
                <div
                  key={id}
                  style={{
                    margin: 5,
                    padding: 10,
                    backgroundColor: player.color,
                    color: "#fff",
                  }}
                >
                  {index + 1}. {id} {id === playerId ? "(You)" : ""}{" "}
                  {gameState.turn === id ? "(Current Turn)" : ""}
                  {gameState.lastRolls?.[id] && (
                    <> - Last Roll: {gameState.lastRolls[id][0]} + {gameState.lastRolls[id][1]} = {gameState.lastRolls[id][0] + gameState.lastRolls[id][1]}</>
                  )}
                </div>
              );
            })}
          </div>


          {/* dice roll */}
          {gameState.lastRoll && (
            <p>
              <strong>Last Roll:</strong> {gameState.lastRoll[0]} + {gameState.lastRoll[1]} = {gameState.lastRoll[0] + gameState.lastRoll[1]}
            </p>
          )}

          {gameState.phase === Phase.ROLL_FOR_TURN_ORDER &&
            !(gameState.turnOrderRolls?.[playerId]) && (
              <button onClick={() => socket.emit(Phase.ROLL_FOR_TURN_ORDER)}>
                Roll Dice for Turn Order
              </button>
            )}

          {gameState.phase === Phase.ROLL_FOR_TURN_ORDER && gameState.turnOrderRolls && (
            <div>
              <h3>Rolls for Turn Order:</h3>
              {Object.entries(gameState.turnOrderRolls).map(([id, roll]) => (
                <p key={id}>
                  {id} {id === playerId ? "(You)" : ""}: {roll}
                </p>
              ))}
            </div>
          )}

          {gameState.phase === Phase.ROLL_FOR_TURN_ORDER && gameState.lastRolls && (
            <div>
              <h3>Live Dice Rolls:</h3>
              {Object.entries(gameState.lastRolls).map(([id, dice]) => (
                <p key={id}>
                  {id} {id === playerId ? "(You)" : ""}: {dice[0]} + {dice[1]} = {dice[0] + dice[1]}
                </p>
              ))}
            </div>
          )}


          {isLobby && (
            <button onClick={() => socket.emit("changeColor")}>
              Change My Color
            </button>
          )}
          {/* host buttons */}
          {isLobby && isHost && (
            <button onClick={() => socket.emit("startGame")}>
              Start Game
            </button>
          )}
          {isLobby && isHost && (
            <button onClick={() => socket.emit("rerollBoard")}>
              Reroll Board
            </button>
          )}
          {isLobby === false && isHost && (
            <button onClick={() => socket.emit("exitToLobby")}>
              Exit to Lobby
            </button>
          )}


          {isLobby === false && isMyTurn && gameState.turnPhase === TurnPhase.ROLL && (
            <button onClick={() => socket.emit("rollDice")}>Roll Dice</button>
          )}

          {isMyTurn && gameState.turnPhase === TurnPhase.ACTION && (
            <>
              {isMyTurn && gameState.turnPhase === TurnPhase.ACTION && (
                <>
                  {/* <button onClick={() => setBuildMode("road")}>Road</button> */}
                  <button
                    style={{
                      backgroundColor: buildMode === BuildTypes.ROAD ? "palegreen" : "",
                      cursor: "pointer"
                    }}
                    onClick={() => {
                      setBuildMode(buildMode == BuildTypes.ROAD ? null : BuildTypes.ROAD)
                    }}>
                    Road
                  </button>
                  <button
                    style={{
                      backgroundColor: buildMode === BuildTypes.HOUSE ? "palegreen" : "",
                      cursor: "pointer"
                    }}
                    onClick={() => {
                      setBuildMode(buildMode == BuildTypes.HOUSE ? null : BuildTypes.HOUSE)
                    }}>
                    House
                  </button>
                  <button
                    style={{
                      backgroundColor: buildMode === BuildTypes.CITY ? "palegreen" : "",
                      cursor: "pointer"
                    }}
                    onClick={() => {
                      setBuildMode(buildMode == BuildTypes.CITY ? null : BuildTypes.CITY)
                    }}>
                    City
                  </button>
                  {/* <button onClick={() => setBuildMode("city")}>City</button> */}
                  <button onClick={() => socket.emit("actionCard")}>Action Card</button>
                  <button onClick={() => socket.emit("trade")}>Trade</button>
                  <button onClick={() => {
                    setBuildMode(null);
                    socket.emit("endTurn")
                  }}>End Turn</button>
                </>
              )}
            </>
          )}

          <GameInfo
            turnOrder={gameState.turnOrder || []}
            players={gameState.players || {}}
            currentPlayerId={gameState.turn}
            myPlayerId={playerId}
            hostId={gameState.hostId}
            lastRoll={gameState.lastRoll || {}}
            bankResources={gameState.bankResources}
          ></GameInfo>

          <PlayerInventory
            resources={myResources}
            ports={myPorts}
            myPlayerId={playerId}
          ></PlayerInventory>

        </div>
        <div
          ref={boardRef}
          style={{ flex: 2, maxWidth: '60%', overflow: 'hidden' }}
        >
          <div style={{ border: "4px solid red" }}>
            <HexBoard
              boardLayout={gameState.boardLayout || []}
              tiles={gameState.tiles || []}
              vertices={gameState.vertices || []}
              edges={gameState.edges || []}
              ports={gameState.ports || []}
              players={gameState.players || {}}
              currentPlayerId={gameState.turn}
              myPlayerId={playerId}
              // onPlaceHouse={(vertexKey) => socket.emit("placeHouse", { vertexKey })}
              onPlaceHouse={(vertexKey) => {
                console.log("Emitting placeHouse to backend:", vertexKey);
                socket.emit("placeHouse", { vertexKey });
                setBuildMode(null);
              }}
              // onPlaceRoad={(edgeKey) => socket.emit("placeRoad", { edgeKey })}
              onPlaceRoad={(edgeKey) => {
                console.log("Emitting placeRoad to backend:", edgeKey);
                socket.emit("placeRoad", { edgeKey });
                setBuildMode(null);
              }}
              onPlaceCity={(vertexKey) => {
                console.log("Emitting placeCity to backend:", vertexKey);
                socket.emit("placeCity", { vertexKey });
                setBuildMode(null);
              }}
              scale={boardScale}
              gameState={gameState}
              socket={socket}
              buildMode={buildMode}
            />

          </div>
        </div>
        <div style={{ flex: 2, maxWidth: '15%' }}>
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

    </div>
  );
}

export default App;
