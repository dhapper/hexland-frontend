import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:4000");


function App() {
  const [gameState, setGameState] = useState({
    players: {},
    turn: null,
    phase: "lobby",
    hostId: null
  });

  const [playerId, setPlayerId] = useState(null);

  const myId = playerId; // 👈 single source of truth
  const isHost = gameState.hostId === myId;
  const isLobby = gameState.phase === "lobby";

  useEffect(() => {
    // Persistent player ID
    let savedId = localStorage.getItem("playerId");
    if (!savedId) {
      savedId = `player_${Math.floor(Math.random() * 100000)}`;
      localStorage.setItem("playerId", savedId);
    }
    setPlayerId(savedId);

    socket.emit("registerPlayer", savedId);

    socket.on("gameState", (state) => {
      setGameState(state);
    });

    return () => socket.off("gameState");
  }, []);

  const isMyTurn = playerId === gameState.turn;

  return (
    <div style={{ padding: 20, background: "#524f4f", height: "100vh" }}>
      <h1>Player Sync Test</h1>
      <p>
        <strong>Phase:</strong>{" "}
        {gameState.phase === "lobby" ? "Lobby" : "In Game"}
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

      {gameState.phase === "rollForTurnOrder" &&
        !(gameState.turnOrderRolls?.[playerId]) && (
          <button onClick={() => socket.emit("rollForTurnOrder")}>
            Roll Dice for Turn Order
          </button>
        )}

      {gameState.phase === "rollForTurnOrder" && gameState.turnOrderRolls && (
        <div>
          <h3>Rolls for Turn Order:</h3>
          {Object.entries(gameState.turnOrderRolls).map(([id, roll]) => (
            <p key={id}>
              {id} {id === playerId ? "(You)" : ""}: {roll}
            </p>
          ))}
        </div>
      )}

      {gameState.phase === "rollForTurnOrder" && gameState.lastRolls && (
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
      {isLobby === false && isHost && (
        <button onClick={() => socket.emit("exitToLobby")}>
          Exit to Lobby
        </button>
      )}


      {isLobby === false && isMyTurn && gameState.turnPhase === "roll" && (
        <button onClick={() => socket.emit("rollDice")}>Roll Dice</button>
      )}

      {isMyTurn && gameState.turnPhase === "action" && (
        <>
          <button onClick={() => socket.emit("buildRoad")}>Road</button>
          <button onClick={() => socket.emit("buildHouse")}>House</button>
          <button onClick={() => socket.emit("buildCity")}>City</button>
          <button onClick={() => socket.emit("actionCard")}>Action Card</button>
          <button onClick={() => socket.emit("trade")}>Trade</button>
          <button onClick={() => socket.emit("endTurn")}>End Turn</button>
        </>
      )}


    </div>
  );
}

export default App;
