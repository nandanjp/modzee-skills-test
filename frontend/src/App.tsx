import CreateUser from "./components/forms/CreateUser";
import { ModeToggle } from "./components/mode-toggle";

function App() {
  return (
    <div className="w-full">
      <nav className="w-full flex items-center justify-between gap-4 px-4 py-3">
        <div className="">
          <ModeToggle />
        </div>
        <div className="">
          <ModeToggle />
        </div>
      </nav>
      <div className="h-full w-full flex items-center justify-center gap-8 p-6">
        <CreateUser />
      </div>
    </div>
  );
}

export default App;
