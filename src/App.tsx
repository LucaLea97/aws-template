import { useEffect, useState } from "react";
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";

const client = generateClient<Schema>();

function App() {
  const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);

  return (
    <main>
      <h1>My todos</h1>
      <button onClick={createTodo}>+ new</button>
    </main>
  );
}

export default App;
