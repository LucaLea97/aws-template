import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import supabase from "../utils/supabase.js";
import {Auth} from "@supabase/auth-ui-react";

function LoginPage() {
    const navigate = useNavigate();

    useEffect(() => {
        const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
            if (session) {
                navigate('/'); // Redirect to home page on success
            }
        });
        return () => authListener?.subscription.unsubscribe();
    }, [navigate]);

    return (
        <div>
            <h2>Login or Sign Up</h2>
            <Auth
                supabaseClient={supabase}
                appearance={{
                    theme: ThemeSupa,
                }}
                providers={[]}
                theme="dark"
            />
        </div>
    );
}

export default LoginPage;
