import type { Difficulty, Question, Topic, TopicId } from "./types";

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
    difficulty: "easy",
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
    difficulty: "easy",
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
    difficulty: "medium",
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
    difficulty: "easy",
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
    difficulty: "hard",
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
    id: "arr-6",
    difficulty: "easy",
    topicId: "arrays",
    prompt: "In C, Java and Python, the first element of an array is at index…",
    options: [
      { id: "a", text: "0" },
      { id: "b", text: "1" },
      { id: "c", text: "-1" },
      { id: "d", text: "It depends on the array size" },
    ],
    correctOptionId: "a",
    explanation:
      "These languages use zero-based indexing: the index is the offset from the start of the array, so the first element is at offset 0.",
  },
  {
    id: "arr-7",
    difficulty: "medium",
    topicId: "arrays",
    prompt: "A dynamic array doubles its capacity whenever it is full. The amortized cost of one append is…",
    options: [
      { id: "a", text: "O(1)" },
      { id: "b", text: "O(log n)" },
      { id: "c", text: "O(n)" },
      { id: "d", text: "O(n log n)" },
    ],
    correctOptionId: "a",
    explanation:
      "A resize copies n items, but it only happens after n cheap appends. Spread over those appends, the copy work adds a constant per append, so the amortized cost is O(1).",
  },
  {
    id: "arr-8",
    difficulty: "medium",
    topicId: "arrays",
    prompt: "Which technique finds two numbers in a sorted array that add up to a target in O(n) time?",
    options: [
      { id: "a", text: "Check every pair with nested loops" },
      { id: "b", text: "Two pointers starting at both ends and moving inward" },
      { id: "c", text: "Sort the array again, then scan it" },
      { id: "d", text: "Binary search inside a nested loop" },
    ],
    correctOptionId: "b",
    explanation:
      "With one pointer at each end: if the sum is too small move the left pointer right, if too big move the right pointer left. Each step discards one element, so it is O(n).",
  },
  {
    id: "arr-9",
    difficulty: "hard",
    topicId: "arrays",
    prompt: "Kadane's algorithm finds the maximum-sum contiguous subarray in…",
    options: [
      { id: "a", text: "O(n²)" },
      { id: "b", text: "O(n log n)" },
      { id: "c", text: "O(n)" },
      { id: "d", text: "O(1)" },
    ],
    correctOptionId: "c",
    explanation:
      "Kadane keeps the best sum ending at the current index and the best sum seen so far, updating both in one pass, which is O(n).",
  },
  {
    id: "arr-10",
    difficulty: "medium",
    topicId: "arrays",
    prompt: "Deleting the element at index i of an n-element array while keeping the order takes, in the worst case…",
    options: [
      { id: "a", text: "O(1)" },
      { id: "b", text: "O(log n)" },
      { id: "c", text: "O(n)" },
      { id: "d", text: "O(n²)" },
    ],
    correctOptionId: "c",
    explanation:
      "Every element after i has to shift one slot left. Deleting index 0 shifts n-1 elements, so the worst case is O(n).",
  },

  {
    id: "ll-1",
    difficulty: "easy",
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
    difficulty: "easy",
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
    difficulty: "medium",
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
    difficulty: "hard",
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
    id: "ll-5",
    difficulty: "easy",
    topicId: "linked-lists",
    prompt: "Each node of a doubly linked list stores…",
    options: [
      { id: "a", text: "Only its data" },
      { id: "b", text: "Its data, a next pointer and a previous pointer" },
      { id: "c", text: "Its data and the list's length" },
      { id: "d", text: "Its data and its index" },
    ],
    correctOptionId: "b",
    explanation:
      "Doubly linked nodes keep links in both directions (next and prev). That lets you walk backwards and unlink a node without searching for its predecessor.",
  },
  {
    id: "ll-6",
    difficulty: "medium",
    topicId: "linked-lists",
    prompt: "Given a pointer to a node in a doubly linked list, removing that node takes…",
    options: [
      { id: "a", text: "O(1)" },
      { id: "b", text: "O(log n)" },
      { id: "c", text: "O(n)" },
      { id: "d", text: "O(n²)" },
    ],
    correctOptionId: "a",
    explanation:
      "The node already knows its neighbours through prev and next, so you just relink them. That is a constant amount of pointer work.",
  },
  {
    id: "ll-7",
    difficulty: "medium",
    topicId: "linked-lists",
    prompt: "To find the middle of a singly linked list in a single pass you can…",
    options: [
      { id: "a", text: "Count the nodes, then walk again" },
      { id: "b", text: "Binary search the list" },
      { id: "c", text: "Move a slow pointer 1 step and a fast pointer 2 steps until fast reaches the end" },
      { id: "d", text: "Copy the list into an array" },
    ],
    correctOptionId: "c",
    explanation:
      "When the fast pointer reaches the end, the slow pointer has gone half as far, so it sits on the middle node. That takes one pass with O(1) extra space.",
  },
  {
    id: "ll-8",
    difficulty: "easy",
    topicId: "linked-lists",
    prompt: "Why is binary search a poor fit for a linked list?",
    options: [
      { id: "a", text: "Linked lists can't be sorted" },
      { id: "b", text: "There is no O(1) access to the middle element" },
      { id: "c", text: "Linked lists can't hold duplicates" },
      { id: "d", text: "Binary search only works on numbers" },
    ],
    correctOptionId: "b",
    explanation:
      "Binary search jumps to the middle each step. On a linked list, getting to the middle means walking node by node, which loses the O(log n) benefit.",
  },
  {
    id: "ll-9",
    difficulty: "hard",
    topicId: "linked-lists",
    prompt: "Merging two sorted singly linked lists of lengths m and n into one sorted list takes…",
    options: [
      { id: "a", text: "O(m + n) time and O(1) extra space" },
      { id: "b", text: "O(m · n) time" },
      { id: "c", text: "O((m + n) log(m + n)) time" },
      { id: "d", text: "O(m + n) time and O(m + n) extra space" },
    ],
    correctOptionId: "a",
    explanation:
      "Walk both lists once, always linking the smaller head onto the result. Nodes are relinked, not copied, so it is linear time with constant extra space.",
  },
  {
    id: "ll-10",
    difficulty: "medium",
    topicId: "linked-lists",
    prompt: "In a circular singly linked list, the last node's next pointer…",
    options: [
      { id: "a", text: "Is null" },
      { id: "b", text: "Points to itself" },
      { id: "c", text: "Points to the middle node" },
      { id: "d", text: "Points back to the head" },
    ],
    correctOptionId: "d",
    explanation:
      "That's what makes it circular: the tail links back to the head, so a traversal never hits null. You stop when you come back to the start.",
  },

  {
    id: "sq-1",
    difficulty: "easy",
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
    difficulty: "hard",
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
    difficulty: "medium",
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
    difficulty: "easy",
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
    id: "sq-5",
    difficulty: "easy",
    topicId: "stacks-queues",
    prompt: "Checking whether brackets like ( [ { } ] ) are balanced is a classic use of a…",
    options: [
      { id: "a", text: "Stack" },
      { id: "b", text: "Queue" },
      { id: "c", text: "Heap" },
      { id: "d", text: "Hash table" },
    ],
    correctOptionId: "a",
    explanation:
      "Push each opening bracket and pop when you see a closing one. If the popped bracket doesn't match, or the stack isn't empty at the end, the input is unbalanced.",
  },
  {
    id: "sq-6",
    difficulty: "medium",
    topicId: "stacks-queues",
    prompt: "Implementing a queue with a circular buffer (ring buffer) avoids…",
    options: [
      { id: "a", text: "Using an array" },
      { id: "b", text: "Having a front index" },
      { id: "c", text: "Shifting every element after each dequeue" },
      { id: "d", text: "Any capacity limit" },
    ],
    correctOptionId: "c",
    explanation:
      "Front and rear indices wrap around with modulo arithmetic, so dequeue just moves the front index. No elements are shifted, so both operations are O(1).",
  },
  {
    id: "sq-7",
    difficulty: "medium",
    topicId: "stacks-queues",
    prompt: "Which data structure keeps track of active function calls during recursion?",
    options: [
      { id: "a", text: "A queue" },
      { id: "b", text: "The call stack" },
      { id: "c", text: "A heap" },
      { id: "d", text: "A linked hash map" },
    ],
    correctOptionId: "b",
    explanation:
      "Each call pushes a stack frame and each return pops it. The most recent call finishes first, which is LIFO.",
  },
  {
    id: "sq-8",
    difficulty: "hard",
    topicId: "stacks-queues",
    prompt: "Using a monotonic stack, the next greater element for every item of an n-element array can be found in…",
    options: [
      { id: "a", text: "O(n²)" },
      { id: "b", text: "O(n)" },
      { id: "c", text: "O(n log n)" },
      { id: "d", text: "O(log n)" },
    ],
    correctOptionId: "b",
    explanation:
      "Each index is pushed once and popped at most once. Even with the inner while-loop, the total work is linear.",
  },
  {
    id: "sq-9",
    difficulty: "easy",
    topicId: "stacks-queues",
    prompt: "In a queue, enqueue adds an item to the ___ and dequeue removes an item from the ___.",
    options: [
      { id: "a", text: "rear, front" },
      { id: "b", text: "front, rear" },
      { id: "c", text: "top, top" },
      { id: "d", text: "middle, front" },
    ],
    correctOptionId: "a",
    explanation:
      "Queues are FIFO: new items join at the rear and the oldest item leaves from the front.",
  },
  {
    id: "sq-10",
    difficulty: "medium",
    topicId: "stacks-queues",
    prompt: "A priority queue is most commonly implemented with a…",
    options: [
      { id: "a", text: "Sorted linked list" },
      { id: "b", text: "Plain stack" },
      { id: "c", text: "Hash table" },
      { id: "d", text: "Binary heap" },
    ],
    correctOptionId: "d",
    explanation:
      "A binary heap gives O(log n) insert and remove-min/max with O(1) peek, which is the best general balance for a priority queue.",
  },

  {
    id: "tr-1",
    difficulty: "easy",
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
    difficulty: "medium",
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
    difficulty: "hard",
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
    difficulty: "medium",
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
    id: "tr-5",
    difficulty: "easy",
    topicId: "trees",
    prompt: "The maximum number of children a node can have in a binary tree is…",
    options: [
      { id: "a", text: "1" },
      { id: "b", text: "2" },
      { id: "c", text: "3" },
      { id: "d", text: "Unlimited" },
    ],
    correctOptionId: "b",
    explanation:
      "Binary means two: each node has at most a left child and a right child.",
  },
  {
    id: "tr-6",
    difficulty: "medium",
    topicId: "trees",
    prompt: "Which traversal visits a node before visiting its subtrees?",
    options: [
      { id: "a", text: "In-order" },
      { id: "b", text: "Post-order" },
      { id: "c", text: "Pre-order" },
      { id: "d", text: "Level-order only" },
    ],
    correctOptionId: "c",
    explanation:
      "Pre-order is node, left, right. It's handy for copying a tree or printing its structure top-down.",
  },
  {
    id: "tr-7",
    difficulty: "medium",
    topicId: "trees",
    prompt: "The worst-case search time in an unbalanced BST with n nodes is…",
    options: [
      { id: "a", text: "O(1)" },
      { id: "b", text: "O(log n)" },
      { id: "c", text: "O(n)" },
      { id: "d", text: "O(n log n)" },
    ],
    correctOptionId: "c",
    explanation:
      "If keys are inserted in sorted order, the BST turns into a chain like a linked list, so a search may visit all n nodes.",
  },
  {
    id: "tr-8",
    difficulty: "easy",
    topicId: "trees",
    prompt: "A tree node with no children is called a…",
    options: [
      { id: "a", text: "Root" },
      { id: "b", text: "Leaf" },
      { id: "c", text: "Branch" },
      { id: "d", text: "Sibling" },
    ],
    correctOptionId: "b",
    explanation:
      "Leaves are the end points of a tree. The root is the single node at the top with no parent.",
  },
  {
    id: "tr-9",
    difficulty: "hard",
    topicId: "trees",
    prompt: "When deleting a BST node that has two children, a standard approach replaces it with…",
    options: [
      { id: "a", text: "Its parent" },
      { id: "b", text: "Any leaf" },
      { id: "c", text: "Its in-order successor (the smallest key in its right subtree)" },
      { id: "d", text: "The root" },
    ],
    correctOptionId: "c",
    explanation:
      "The in-order successor is larger than everything on the left and smaller than the rest of the right subtree, so the BST ordering stays valid. The in-order predecessor works too.",
  },
  {
    id: "tr-10",
    difficulty: "medium",
    topicId: "trees",
    prompt: "The height of a complete binary tree with n nodes is about…",
    options: [
      { id: "a", text: "n" },
      { id: "b", text: "n / 2" },
      { id: "c", text: "√n" },
      { id: "d", text: "⌊log₂ n⌋" },
    ],
    correctOptionId: "d",
    explanation:
      "Each level doubles the number of nodes, so n nodes fit in about log₂ n levels. That's why heap operations are O(log n).",
  },

  {
    id: "gr-1",
    difficulty: "medium",
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
    difficulty: "medium",
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
    difficulty: "hard",
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
    difficulty: "easy",
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
    id: "gr-5",
    difficulty: "easy",
    topicId: "graphs",
    prompt: "An adjacency matrix for a graph with V vertices uses how much memory?",
    options: [
      { id: "a", text: "O(V)" },
      { id: "b", text: "O(E)" },
      { id: "c", text: "O(V + E)" },
      { id: "d", text: "O(V²)" },
    ],
    correctOptionId: "d",
    explanation:
      "The matrix has one cell for every pair of vertices, which is V × V cells no matter how many edges exist. Adjacency lists use O(V + E) instead.",
  },
  {
    id: "gr-6",
    difficulty: "medium",
    topicId: "graphs",
    prompt: "Which graph traversal is naturally implemented with a stack or recursion?",
    options: [
      { id: "a", text: "Breadth-first search" },
      { id: "b", text: "Depth-first search" },
      { id: "c", text: "Dijkstra's algorithm" },
      { id: "d", text: "Prim's algorithm" },
    ],
    correctOptionId: "b",
    explanation:
      "DFS goes as deep as possible before backtracking, which is exactly LIFO. BFS uses a queue instead.",
  },
  {
    id: "gr-7",
    difficulty: "medium",
    topicId: "graphs",
    prompt: "A topological ordering of a graph exists only if the graph is…",
    options: [
      { id: "a", text: "Undirected" },
      { id: "b", text: "Complete" },
      { id: "c", text: "A directed acyclic graph (DAG)" },
      { id: "d", text: "Weighted" },
    ],
    correctOptionId: "c",
    explanation:
      "Topological order puts every edge u→v with u before v. A cycle makes that impossible, so the graph must be directed and acyclic.",
  },
  {
    id: "gr-8",
    difficulty: "hard",
    topicId: "graphs",
    prompt: "Dijkstra's algorithm can give wrong shortest-path answers when the graph has…",
    options: [
      { id: "a", text: "Negative edge weights" },
      { id: "b", text: "More edges than vertices" },
      { id: "c", text: "Undirected edges" },
      { id: "d", text: "Self-loops of weight 0" },
    ],
    correctOptionId: "a",
    explanation:
      "Dijkstra assumes a vertex's distance is final once it is removed from the priority queue. A negative edge found later could still make that distance shorter.",
  },
  {
    id: "gr-9",
    difficulty: "medium",
    topicId: "graphs",
    prompt: "BFS on a graph with V vertices and E edges stored as adjacency lists runs in…",
    options: [
      { id: "a", text: "O(V)" },
      { id: "b", text: "O(V²)" },
      { id: "c", text: "O(V + E)" },
      { id: "d", text: "O(E log V)" },
    ],
    correctOptionId: "c",
    explanation:
      "Each vertex is enqueued once and each adjacency list is scanned once, so the total work is O(V + E).",
  },
  {
    id: "gr-10",
    difficulty: "hard",
    topicId: "graphs",
    prompt: "Which algorithm finds single-source shortest paths when some edge weights are negative (but there is no negative cycle)?",
    options: [
      { id: "a", text: "Dijkstra's algorithm" },
      { id: "b", text: "Bellman-Ford" },
      { id: "c", text: "Prim's algorithm" },
      { id: "d", text: "Kruskal's algorithm" },
    ],
    correctOptionId: "b",
    explanation:
      "Bellman-Ford relaxes every edge V-1 times, which handles negative weights. One more pass that still improves a distance means there's a negative cycle.",
  },

  {
    id: "ss-1",
    difficulty: "easy",
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
    difficulty: "medium",
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
    difficulty: "medium",
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
    difficulty: "hard",
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
  {
    id: "ss-5",
    difficulty: "easy",
    topicId: "sorting-searching",
    prompt: "Binary search only works correctly when the data is…",
    options: [
      { id: "a", text: "Stored in a linked list" },
      { id: "b", text: "Sorted" },
      { id: "c", text: "Made of unique values" },
      { id: "d", text: "Smaller than 1,000 items" },
    ],
    correctOptionId: "b",
    explanation:
      "Binary search throws away half the range after each comparison, which is only valid if the data is in sorted order.",
  },
  {
    id: "ss-6",
    difficulty: "medium",
    topicId: "sorting-searching",
    prompt: "Insertion sort is fastest when the input is…",
    options: [
      { id: "a", text: "Sorted in reverse" },
      { id: "b", text: "Random" },
      { id: "c", text: "Already sorted or nearly sorted" },
      { id: "d", text: "All negative numbers" },
    ],
    correctOptionId: "c",
    explanation:
      "On sorted input each new element is compared once and stays where it is, so insertion sort runs in O(n). Reverse-sorted input is its O(n²) worst case.",
  },
  {
    id: "ss-7",
    difficulty: "medium",
    topicId: "sorting-searching",
    prompt: "Heapsort's worst-case time and extra space are…",
    options: [
      { id: "a", text: "O(n log n) time, O(1) extra space" },
      { id: "b", text: "O(n²) time, O(1) extra space" },
      { id: "c", text: "O(n log n) time, O(n) extra space" },
      { id: "d", text: "O(n) time, O(n) extra space" },
    ],
    correctOptionId: "a",
    explanation:
      "Building the heap is O(n) and each of the n extractions is O(log n). Everything happens inside the original array, so the extra space is constant.",
  },
  {
    id: "ss-8",
    difficulty: "hard",
    topicId: "sorting-searching",
    prompt: "Counting sort can beat the Ω(n log n) comparison-sort bound because it…",
    options: [
      { id: "a", text: "Uses recursion" },
      { id: "b", text: "Counts how often each key value appears instead of comparing keys" },
      { id: "c", text: "Only works on linked lists" },
      { id: "d", text: "Always sorts fewer than n items" },
    ],
    correctOptionId: "b",
    explanation:
      "The Ω(n log n) bound only applies to comparison sorts. Counting sort indexes an array by key value, so it runs in O(n + k) for keys in a range of size k.",
  },
  {
    id: "ss-9",
    difficulty: "easy",
    topicId: "sorting-searching",
    prompt: "Bubble sort's worst-case time complexity is…",
    options: [
      { id: "a", text: "O(n)" },
      { id: "b", text: "O(log n)" },
      { id: "c", text: "O(n log n)" },
      { id: "d", text: "O(n²)" },
    ],
    correctOptionId: "d",
    explanation:
      "In the worst case each pass moves one element into place, and it takes about n passes of about n comparisons each.",
  },
  {
    id: "ss-10",
    difficulty: "medium",
    topicId: "sorting-searching",
    prompt: "Which of these sorts is generally NOT stable?",
    options: [
      { id: "a", text: "Merge sort" },
      { id: "b", text: "Insertion sort" },
      { id: "c", text: "Typical in-place quicksort" },
      { id: "d", text: "Counting sort" },
    ],
    correctOptionId: "c",
    explanation:
      "In-place partitioning swaps elements across long distances, so equal keys can change their relative order. The other three keep equal keys in their original order.",
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

export const QUESTION_MAP: Record<string, Question> = Object.fromEntries(
  QUESTIONS.map((q) => [q.id, q]),
);

const DIFFICULTY_ORDER: Difficulty[] = ["easy", "medium", "hard"];

function shuffle<T>(items: T[]): T[] {
  const a = [...items];
  for (let i = a.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Builds a fresh randomized diagnostic: `perTopic` questions per selected
 * topic, drawn from that topic's 10-question pool. It tries to take one easy,
 * one medium and one hard question so every topic is measured across the
 * same spread of difficulty, then fills any gap at random. Questions stay
 * grouped by topic (in course order) and go easy -> hard within a topic.
 */
export function buildDiagnostic(topicIds: TopicId[], perTopic = 3): Question[] {
  const ordered = TOPICS.filter((t) => topicIds.includes(t.id));
  const out: Question[] = [];
  for (const topic of ordered) {
    const pool = shuffle(QUESTIONS.filter((q) => q.topicId === topic.id));
    const picked: Question[] = [];
    for (const level of DIFFICULTY_ORDER) {
      if (picked.length >= perTopic) break;
      const q = pool.find((x) => x.difficulty === level && !picked.includes(x));
      if (q) picked.push(q);
    }
    for (const q of pool) {
      if (picked.length >= perTopic) break;
      if (!picked.includes(q)) picked.push(q);
    }
    picked.sort((a, b) => DIFFICULTY_ORDER.indexOf(a.difficulty) - DIFFICULTY_ORDER.indexOf(b.difficulty));
    out.push(...picked);
  }
  return out;
}
