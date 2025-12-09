import {GoogleLogin} from "@react-oauth/google";

const LoginButton = () => {
    return (
            <GoogleLogin
                onSuccess={
                    async credentialResponse => {
                        const token = credentialResponse.credential;

                        const res = await fetch("http://127.0.0.1:8000/auth/google", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ token }),
                        });
                        const data = await res.json();
                        console.log("Server response:", data);
                    }
                }
                onError={() => console.log("Login Failed")}
            />
    );
};

export default LoginButton;