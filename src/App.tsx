feat/mqtt
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';
import supabase from "./utils/supabase.js";
import { useMqtt } from "./hooks/useMqtt.js";

function App() {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    const { ledState, sendMessage } = useMqtt();

    useEffect(() => {
        async function checkUser() {
            const { data, error } = await supabase.auth.getUser();
            if (error || !data.user) {
                navigate('/login'); // Redirect to login page
            } else {
                setUser(data.user);
            }
        }
        checkUser();
    }, [navigate]);

    if (!user) return null; // Prevent UI flicker before redirect

    async function handleLogout() {
        await supabase.auth.signOut();
        navigate('/login');
    }

    return (
        <>
            <main>
                <h1>Clelia</h1>
                <h3>Hello {user.email}</h3>
                <button onClick={() => sendMessage(1, "ON")}>Turn on Led</button>
                <button onClick={() => sendMessage(1, "OFF")}>Turn off Led</button>
                <aside>
                    <button> Map </button>
                    <button> Controls </button>
                </aside>
                <aside style={{marginTop: '2rem'}}>
                    <p className="text-lg">LED ID: {ledState.id || "None"}</p>
                    <p className="text-lg">Current State: {ledState.state}</p>
                </aside>
                <button onClick={handleLogout}>Logout</button>
                <footer>Lea Renergy s.r.l.</footer>
            </main>
        </>
    );
}

export default App;
