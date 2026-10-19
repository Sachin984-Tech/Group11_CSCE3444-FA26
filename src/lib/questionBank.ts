import type { Question, Topic, TopicId } from "./types";

export const TOPICS: Topic[] = [
  {
    id: "arrays",
    name: "Arrays",
    blurb:
      "Contiguous memory, O(1) random access, and the foundation almost every other structure builds on.",
    prerequisites: [],
    defaultOrder: 1,
    accent: "emerald",
    icon: "▦",
  },
  {
    id: "linked-lists",
    name: "Linked Lists",
    blurb:
      "Pointer-chasing nodes - singly, doubly, circular. Trade random access for cheap insertions.",
    prerequisites: ["arrays"],
    defaultOrder: 2,
    accent: "violet",
    icon: "⇄",
  },
  {
    id: "stacks-queues",
    name: "Stacks & Queues",
    blurb:
      "LIFO and FIFO disciplines. Backtracking, BFS, undo stacks, scheduler queues - they show up everywhere.",
    prerequisites: ["linked-lists"],
    defaultOrder: 3,
    accent: "amber",
    icon: "▤",
  },
  {
    id: "trees",
    name: "Trees",
    blurb:
      "Hierarchical, recursive structures. BSTs, AVLs, heaps. The gateway drug to logarithmic everything.",
    prerequisites: ["linked-lists", "stacks-queues"],
    defaultOrder: 4,
    accent: "fuchsia",
    icon: "⌥",
  },
  {
    id: "graphs",
    name: "Graphs",
    blurb:
      "Vertices and edges - directed, undirected, weighted. Trees with multiple parents and a serious attitude.",
    prerequisites: ["trees", "stacks-queues"],
    defaultOrder: 5,
    accent: "rose",
    icon: "◈",
  },
  {
    id: "sorting-searching",
    name: "Sorting & Searching",
    blurb:
      "Comparison sorts, divide-and-conquer, binary search. The reason your laptop feels faster than it should.",
    prerequisites: ["arrays", "trees"],
    defaultOrder: 6,
    accent: "teal",
    icon: "⇅",
  },
];

export const TOPIC_MAP: Record<TopicId, Topic> = TOPICS.reduce(
  (acc, t) => {
    acc[t.id] = t;
    return acc;
  },
  {} as Record<TopicId, Topic>,
);

export const QUESTIONS: Question[] = [
  {
    id: "arr-1",
    topicId: "arrays",
    prompt: "What is the time complexity of accessing an element by index in a standard array?",
    options: [
      { id: "a", text: "O(1)" },
      { id: "b", text: "O(log n)" },
      { id: "c", text: "O(n)" },
      { id: "d", text: "O(n log n)" },
    ],
    correctOptionId: "a",
    explanation:
      "Arrays store elements in contiguous memory, so the address of any index can be computed in constant time using base + index x elementSize.",
  },
  {
    id: "arr-2",
    topicId: "arrays",
    prompt: "Inserting an element at the front of an array of size n takes…",
    options: [
      { id: "a", text: "O(1)" },
      { id: "b", text: "O(log n)" },
      { id: "c", text: "O(n)" },
      { id: "d", text: "O(n²)" },
    ],
    correctOptionId: "c",
    explanation:
      "Every existing element has to shift one slot right to make room at index 0, which is linear in n.",
  },
  {
    id: "arr-3",
    topicId: "arrays",
    prompt: "Which problem with arrays does a dynamic array (like ArrayList) mostly solve?",
    options: [
      { id: "a", text: "Slow random access" },
      { id: "b", text: "Fixed capacity at allocation time" },
      { id: "c", text: "Slow middle insertion" },
      { id: "d", text: "High memory overhead per element" },
    ],
    correctOptionId: "b",
    explanation:
      "A dynamic array grows its backing storage on demand, so callers no longer have to commit to a fixed size up front.",
  },
  {
    id: "arr-4",
    topicId: "arrays",
    prompt: "What is the worst-case time to find an unsorted value in an array of size n?",
    options: [
      { id: "a", text: "O(1)" },
      { id: "b", text: "O(log n)" },
      { id: "c", text: "O(n)" },
      { id: "d", text: "O(n!)" },
    ],
    correctOptionId: "c",
    explanation:
      "With no ordering guarantee you may need to scan every element, which is linear.",
  },
  {
    id: "arr-5",
    topicId: "arrays",
    prompt: "A two-dimensional array `int[8][4]` uses row-major layout. The element at (r, c) lives at offset…",
    options: [
      { id: "a", text: "r * 4 + c" },
      { id: "b", text: "c * 8 + r" },
      { id: "c", text: "r + c * 8" },
      { id: "d", text: "(r + c) * 4" },
    ],
    correctOptionId: "a",
    explanation:
      "Row-major means each row has length 4, so the offset is row * numberOfColumns + column.",
  },

  {
    id: "ll-1",
    topicId: "linked-lists",
    prompt: "What's the time complexity of inserting at the head of a singly linked list?",
    options: [
      { id: "a", text: "O(1)" },
      { id: "b", text: "O(log n)" },
      { id: "c", text: "O(n)" },
      { id: "d", text: "O(n²)" },
    ],
    correctOptionId: "a",
    explanation:
      "You allocate a new node, point it at the old head, and update the head pointer - three constant-time operations.",
  },
  {
    id: "ll-2",
    topicId: "linked-lists",
    prompt: "Traversing to the tail of a singly linked list (no tail pointer) is…",
    options: [
      { id: "a", text: "O(1)" },
      { id: "b", text: "O(log n)" },
      { id: "c", text: "O(n)" },
      { id: "d", text: "O(n log n)" },
    ],
    correctOptionId: "c",
    explanation:
      "You have to walk the .next pointers one node at a time until null is hit, which is linear in the list length.",
  },
  {
    id: "ll-3",
    topicId: "linked-lists",
    prompt: "Floyd's two-pointer cycle-detection trick returns true when…",
    options: [
      { id: "a", text: "slow == null" },
      { id: "b", text: "fast == slow" },
      { id: "c", text: "fast.next == slow" },
      { id: "d", text: "fast == null" },
    ],
    correctOptionId: "b",
    explanation:
      "If a cycle exists, the fast pointer eventually laps the slow pointer and the two references become equal inside the cycle.",
  },
  {
    id: "ll-4",
    topicId: "linked-lists",
    prompt: "Reversing a singly linked list iteratively needs how many pointers walking forward at once?",
    options: [
      { id: "a", text: "1" },
      { id: "b", text: "2" },
      { id: "c", text: "3" },
      { id: "d", text: "4" },
    ],
    correctOptionId: "c",
    explanation:
      "Classic in-place reverse keeps prev, curr, and next - three pointers - so each step can flip curr.next without losing the rest of the list.",
  },

  {
    id: "sq-1",
    topicId: "stacks-queues",
    prompt: "Which problem is a stack naturally suited for?",
    options: [
      { id: "a", text: "First-come first-served scheduling" },
      { id: "b", text: "Backtracking and undo" },
      { id: "c", text: "Round-robin dispatch" },
      { id: "d", text: "Priority-based serving" },
    ],
    correctOptionId: "b",
    explanation:
      "Stacks are LIFO: the most recently pushed item is the first to come back, which is exactly what backtracking and undo need.",
  },
  {
    id: "sq-2",
    topicId: "stacks-queues",
    prompt: "A queue implemented with two stacks gives an amortized cost per operation of…",
    options: [
      { id: "a", text: "O(1) amortized" },
      { id: "b", text: "O(log n) amortized" },
      { id: "c", text: "O(n) amortized" },
      { id: "d", text: "O(n²) amortized" },
    ],
    correctOptionId: "a",
    explanation:
      "Each element is pushed and popped at most twice across its lifetime, so enqueue+dequeue together average O(1) per operation.",
  },
  {
    id: "sq-3",
    topicId: "stacks-queues",
    prompt: "Which traversal is most naturally implemented with a queue?",
    options: [
      { id: "a", text: "Pre-order DFS" },
      { id: "b", text: "In-order DFS" },
      { id: "c", text: "Post-order DFS" },
      { id: "d", text: "Level-order BFS" },
    ],
    correctOptionId: "d",
    explanation:
      "BFS visits nodes level by level, and a FIFO queue keeps the discovered-but-unvisited nodes in exactly the order BFS needs them.",
  },
  {
    id: "sq-4",
    topicId: "stacks-queues",
    prompt: "Which order does a stack's pop() return elements in?",
    options: [
      { id: "a", text: "FIFO - oldest first" },
      { id: "b", text: "LIFO - newest first" },
      { id: "c", text: "Sorted ascending" },
      { id: "d", text: "Random" },
    ],
    correctOptionId: "b",
    explanation:
      "A stack pops the most recently pushed element first - Last In, First Out.",
  },

  {
    id: "tr-1",
    topicId: "trees",
    prompt: "In a BST, an in-order traversal yields values in what order?",
    options: [
      { id: "a", text: "Random" },
      { id: "b", text: "Descending" },
      { id: "c", text: "Ascending" },
      { id: "d", text: "Insertion order" },
    ],
    correctOptionId: "c",
    explanation:
      "In-order visits left subtree, then node, then right subtree - and for a BST that produces strictly increasing values.",
  },
  {
    id: "tr-2",
    topicId: "trees",
    prompt: "A balanced BST (e.g. AVL) keeps search time at…",
    options: [
      { id: "a", text: "O(1)" },
      { id: "b", text: "O(log n)" },
      { id: "c", text: "O(n)" },
      { id: "d", text: "O(n log n)" },
    ],
    correctOptionId: "b",
    explanation:
      "Balance invariants keep the height logarithmic in n, so every search walks at most O(log n) nodes.",
  },
  {
    id: "tr-3",
    topicId: "trees",
    prompt: "Which rotation restores the AVL balance property after a right-right insertion?",
    options: [
      { id: "a", text: "Single left rotation" },
      { id: "b", text: "Single right rotation" },
      { id: "c", text: "Left-Right double rotation" },
      { id: "d", text: "Right-Left double rotation" },
    ],
    correctOptionId: "a",
    explanation:
      "An RR imbalance is fixed with a single left rotation around the unbalanced node - the textbook AVL case.",
  },
  {
    id: "tr-4",
    topicId: "trees",
    prompt: "A binary heap stored as an array places the parent of node i at index…",
    options: [
      { id: "a", text: "i / 2" },
      { id: "b", text: "2i" },
      { id: "c", text: "2i + 1" },
      { id: "d", text: "i + 1" },
    ],
    correctOptionId: "a",
    explanation:
      "1-indexed heaps use parent = floor(i / 2). Children live at 2i and 2i + 1. The arithmetic is the whole reason heaps love arrays.",
  },

  {
    id: "gr-1",
    topicId: "graphs",
    prompt: "BFS on an unweighted graph from source s gives which kind of path to every reachable vertex?",
    options: [
      { id: "a", text: "Shortest path by edge count" },
      { id: "b", text: "Shortest path by total weight" },
      { id: "c", text: "Longest simple path" },
      { id: "d", text: "Lexicographically smallest path" },
    ],
    correctOptionId: "a",
    explanation:
      "BFS expands level by level, so the first time it reaches a vertex it has used the fewest possible edges - the shortest unweighted path.",
  },
  {
    id: "gr-2",
    topicId: "graphs",
    prompt: "Which structure does Dijkstra's algorithm rely on at its core?",
    options: [
      { id: "a", text: "A stack" },
      { id: "b", text: "A min-heap priority queue" },
      { id: "c", text: "A union-find structure" },
      { id: "d", text: "A hash map of in-degrees" },
    ],
    correctOptionId: "b",
    explanation:
      "Dijkstra repeatedly extracts the next-lowest-distance vertex, which a min-heap priority queue gives in O(log n).",
  },
  {
    id: "gr-3",
    topicId: "graphs",
    prompt: "Kruskal's algorithm needs which helper to avoid cycles when building an MST?",
    options: [
      { id: "a", text: "A BFS queue" },
      { id: "b", text: "A disjoint-set (union-find) structure" },
      { id: "c", text: "A Fibonacci heap" },
      { id: "d", text: "An adjacency matrix" },
    ],
    correctOptionId: "b",
    explanation:
      "Each candidate edge joins two vertices. Union-find tells us in near-O(1) whether the two ends are already in the same component - if so, the edge would form a cycle.",
  },
  {
    id: "gr-4",
    topicId: "graphs",
    prompt: "A directed graph with no cycles is called…",
    options: [
      { id: "a", text: "A forest" },
      { id: "b", text: "A DAG" },
      { id: "c", text: "A spanning tree" },
      { id: "d", text: "A bipartite graph" },
    ],
    correctOptionId: "b",
    explanation:
      "Directed Acyclic Graph - DAGs are the backbone of topological sort, dependency resolution, and most scheduling problems.",
  },

  {
    id: "ss-1",
    topicId: "sorting-searching",
    prompt: "Binary search on a sorted array of size n runs in…",
    options: [
      { id: "a", text: "O(1)" },
      { id: "b", text: "O(log n)" },
      { id: "c", text: "O(n)" },
      { id: "d", text: "O(n log n)" },
    ],
    correctOptionId: "b",
    explanation:
      "Each comparison halves the search space, so the work is bounded by log₂(n) iterations.",
  },
  {
    id: "ss-2",
    topicId: "sorting-searching",
    prompt: "Which sort is stable and runs in O(n log n) worst-case on comparisons?",
    options: [
      { id: "a", text: "Quicksort (Lomuto, naive pivot)" },
      { id: "b", text: "Selection sort" },
      { id: "c", text: "Mergesort" },
      { id: "d", text: "Bubble sort" },
    ],
    correctOptionId: "c",
    explanation:
      "Mergesort always splits in half and merges in linear time, giving Θ(n log n) worst-case. The merge step preserves equal-key order, so it's stable.",
  },
  {
    id: "ss-3",
    topicId: "sorting-searching",
    prompt: "The worst-case of naive quicksort on already-sorted input is…",
    options: [
      { id: "a", text: "O(n log n)" },
      { id: "b", text: "O(log n)" },
      { id: "c", text: "O(n²)" },
      { id: "d", text: "O(n)" },
    ],
    correctOptionId: "c",
    explanation:
      "If the pivot is always the first element and the input is sorted, each partition removes only one element, producing n recursive calls of size n-1, n-2, … - quadratic total work.",
  },
  {
    id: "ss-4",
    topicId: "sorting-searching",
    prompt: "Which lower bound applies to any comparison-based sort of n distinct keys?",
    options: [
      { id: "a", text: "Ω(n)" },
      { id: "b", text: "Ω(n log n)" },
      { id: "c", text: "Ω(n²)" },
      { id: "d", text: "Ω(log n)" },
    ],
    correctOptionId: "b",
    explanation:
      "There are n! permutations, and each comparison splits the possibility space in at most two - so any decision tree must have depth ≥ log₂(n!) = Ω(n log n).",
  },
];

export function questionsForTopic(topicId: TopicId, limit?: number): Question[] {
  const list = QUESTIONS.filter((q) => q.topicId === topicId);
  return typeof limit === "number" ? list.slice(0, limit) : list;
}

export function diagnosticQuestionsForTopics(
  topicIds: TopicId[],
  perTopic = 3,
): Question[] {
  const out: Question[] = [];
  for (const id of topicIds) {
    out.push(...questionsForTopic(id, perTopic));
  }
  return out;
}
