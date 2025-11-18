import { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router";
import ChatPage from "./pages/ChatPage";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import { useAuthStore } from "./store/useAuthStore";
import PageLoader from "./component/PageLoader";
import { Toaster } from "react-hot-toast";

const App = () => {
  const { authUser, isCheckingAuth, checkAuth } = useAuthStore();

  // On app load, check if user is authenticated
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  console.log({ authUser });

  if (isCheckingAuth) return <PageLoader></PageLoader>;

  return (
    <div className="min-h-screen bg-slate-900 relative flex items-center justify-center p-4 overflow-hidden">
      {/* DECORATORS - GRID BG & GLOW SHAPES */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px]" />
      <div className="absolute top-0 -left-4 size-96 bg-pink-500 opacity-20 blur-[100px]" />
      <div className="absolute bottom-0 -right-4 size-96 bg-cyan-500 opacity-20 blur-[100px]" />
      <Routes>
        <Route
          path="/"
          element={
            authUser ? (
              <ChatPage></ChatPage>
            ) : (
              <Navigate to={"/login"}></Navigate>
            )
          }
        ></Route>
        <Route
          path="/login"
          element={!authUser ? <Login></Login> : <Navigate to={"/"}></Navigate>}
        ></Route>
        <Route
          path="/signup"
          element={
            !authUser ? <SignUp></SignUp> : <Navigate to={"/"}></Navigate>
          }
        ></Route>
      </Routes>
      <Toaster />
    </div>
  );
};

export default App;
