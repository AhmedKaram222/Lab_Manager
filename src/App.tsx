import { Suspense } from "react";
import { useRoutes } from "react-router-dom";
import routes from "./routes";
import tempoRoutes from "tempo-routes";

function App() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <>
        {useRoutes(routes)}
        {import.meta.env.VITE_TEMPO === "true" && useRoutes(tempoRoutes)}
      </>
    </Suspense>
  );
}

export default App;
