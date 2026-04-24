exports.processHierarchy = (req, res) => {
    try {
        const data = req.body.data;
        if (!data || !Array.isArray(data)) {
            return res.status(400).json({ error: "Invalid input. Expected { 'data': [...] }" });
        }

        const invalid_entries = [];
        const duplicate_edges = [];
        const valid_edges = [];
        const seen_edges = new Set();

        // 1. Validation & 2. Duplicate Handling
        for (let rawEdge of data) {
            if (typeof rawEdge !== 'string') {
                invalid_entries.push(rawEdge);
                continue;
            }
            const edge = rawEdge.trim();
            // Valid format: X->Y (single uppercase letters), no self-loops
            if (!/^[A-Z]->[A-Z]$/.test(edge) || edge[0] === edge[3]) {
                invalid_entries.push(rawEdge);
            } else {
                if (seen_edges.has(edge)) {
                    if (!duplicate_edges.includes(edge)) {
                        duplicate_edges.push(edge);
                    }
                } else {
                    seen_edges.add(edge);
                    valid_edges.push(edge);
                }
            }
        }

        // 3. Tree Construction Prep
        const adjList = {};
        const parentMap = {};
        const nodes = new Set();

        for (const edge of valid_edges) {
            const [u, v] = edge.split('->');
            nodes.add(u);
            nodes.add(v);
            if (!adjList[u]) adjList[u] = [];
            if (!adjList[v]) adjList[v] = [];
            
            // Multi-parent (diamond problem): First parent wins
            if (!(v in parentMap)) {
                parentMap[v] = u;
                adjList[u].push(v);
            }
        }

        const roots = [];
        for (const node of nodes) {
            if (!(node in parentMap)) {
                roots.push(node);
            }
        }
        roots.sort(); // sort lexicographically

        const hierarchies = [];
        const visited = new Set();
        let total_trees = 0;
        let total_cycles = 0;
        let max_depth_overall = -1;
        let largest_tree_root = null;

        // 5. Cycle Detection using DFS
        function buildTree(node, visiting, depth) {
            visited.add(node);
            visiting.add(node);
            let hasCycle = false;
            const tree = {};
            let maxDepth = depth;

            for (const child of adjList[node] || []) {
                if (visiting.has(child)) {
                    hasCycle = true;
                } else {
                    const childResult = buildTree(child, visiting, depth + 1);
                    tree[child] = childResult.tree;
                    if (childResult.hasCycle) hasCycle = true;
                    if (childResult.maxDepth > maxDepth) maxDepth = childResult.maxDepth;
                }
            }
            visiting.delete(node);
            return { tree, hasCycle, maxDepth };
        }

        // Process all valid roots
        for (const root of roots) {
            if (visited.has(root)) continue;
            const result = buildTree(root, new Set(), 1);
            if (result.hasCycle) {
                hierarchies.push({ tree: {}, has_cycle: true });
                total_cycles++;
            } else {
                const treeObj = {};
                treeObj[root] = result.tree;
                hierarchies.push(treeObj);
                total_trees++;
                
                // Depth calculation & tie breaker
                if (result.maxDepth > max_depth_overall) {
                    max_depth_overall = result.maxDepth;
                    largest_tree_root = root;
                } else if (result.maxDepth === max_depth_overall) {
                    if (largest_tree_root === null || root < largest_tree_root) {
                        largest_tree_root = root;
                    }
                }
            }
        }

        // 4. Special Cases: If no root exists -> cycle -> pick lexicographically smallest node
        while (visited.size < nodes.size) {
            const unvisited = Array.from(nodes).filter(n => !visited.has(n)).sort();
            if (unvisited.length === 0) break;
            const root = unvisited[0]; 
            const result = buildTree(root, new Set(), 1);
            if (result.hasCycle) {
                hierarchies.push({ tree: {}, has_cycle: true });
                total_cycles++;
            } else {
                // Failsafe (should theoretically not trigger if isolated properly)
                const treeObj = {};
                treeObj[root] = result.tree;
                hierarchies.push(treeObj);
                total_trees++;
            }
        }

        const summary = {
            total_trees,
            total_cycles,
            largest_tree_root: largest_tree_root || ""
        };

        const response = {
            user_id: "saba_ishrath_24042026",
            email_id: "sabaishrath06@gmail.com",
            college_roll_number: "RA2311003020113",
            hierarchies,
            invalid_entries,
            duplicate_edges,
            summary
        };

        res.json(response);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
};
