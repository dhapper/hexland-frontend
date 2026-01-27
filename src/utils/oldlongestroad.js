// --- Get longest connected road ---
  const getLongestRoad = (edges, filter = () => true) => {
    // Build adjacency map
    const adjacency = {};
    edges.forEach(edge => {
      if (!edge.placed || !filter(edge)) return;
      const v1Key = `${edge.v1.x}_${edge.v1.y}`;
      const v2Key = `${edge.v2.x}_${edge.v2.y}`;
      adjacency[v1Key] = adjacency[v1Key] || [];
      adjacency[v2Key] = adjacency[v2Key] || [];
      adjacency[v1Key].push(edge);
      adjacency[v2Key].push(edge);
    });

    let maxLength = 0;

    const dfs = (vertexKey, visitedEdges) => {
      let localMax = visitedEdges.size;
      for (const edge of adjacency[vertexKey] || []) {
        if (visitedEdges.has(edge)) continue;
        visitedEdges.add(edge);
        const nextVertexKey =
          `${edge.v1.x}_${edge.v1.y}` === vertexKey
            ? `${edge.v2.x}_${edge.v2.y}`
            : `${edge.v1.x}_${edge.v1.y}`;
        localMax = Math.max(localMax, dfs(nextVertexKey, visitedEdges));
        visitedEdges.delete(edge);
      }
      return localMax;
    };

    // Start DFS from each vertex
    Object.keys(adjacency).forEach(vertexKey => {
      maxLength = Math.max(maxLength, dfs(vertexKey, new Set()));
    });

    return maxLength;
  };


  // --- Log longest road whenever edges change ---
  React.useEffect(() => {
    if (edges.length === 0) return;

    const longest = getLongestRoad(edges);
    console.log("Longest road:", longest);
  }, [edges]);