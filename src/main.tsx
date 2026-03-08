import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import Layout from "./Layout/Layout.tsx";
import AuthProvider from "./components/AuthProvider/AuthProvider.tsx";
import {CookiesProvider} from "react-cookie";

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <CookiesProvider>
            <AuthProvider>
                <BrowserRouter>
                    <Layout/>
                </BrowserRouter>
            </AuthProvider>
        </CookiesProvider>
    </StrictMode>
)
