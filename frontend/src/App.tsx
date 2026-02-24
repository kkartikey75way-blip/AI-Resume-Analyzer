import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { Toaster } from 'react-hot-toast';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import UploadResume from './pages/UploadResume';
import AnalysisResult from './pages/AnalysisResult';
import GeneratedResumePage from './pages/GeneratedResume';
import CareerRoadmap from './pages/CareerRoadmap';

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Toaster
                    position="top-right"
                    toastOptions={{
                        duration: 3000,
                        style: {
                            background: '#1a2235',
                            color: '#f1f5f9',
                            border: '1px solid rgba(148, 163, 184, 0.1)',
                            borderRadius: '12px',
                            fontSize: '0.88rem',
                        },
                        success: {
                            iconTheme: {
                                primary: '#10b981',
                                secondary: '#1a2235',
                            },
                        },
                        error: {
                            iconTheme: {
                                primary: '#f43f5e',
                                secondary: '#1a2235',
                            },
                        },
                    }}
                />
                <Routes>
                    {/* Public routes */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    {/* Protected routes */}
                    <Route
                        path="/"
                        element={
                            <ProtectedRoute>
                                <Layout />
                            </ProtectedRoute>
                        }
                    >
                        <Route index element={<Navigate to="/dashboard" replace />} />
                        <Route path="dashboard" element={<Dashboard />} />
                        <Route path="upload" element={<UploadResume />} />
                        <Route path="history" element={<Dashboard />} />
                        <Route path="analysis/:id" element={<AnalysisResult />} />
                        <Route path="analysis/:id/generated" element={<GeneratedResumePage />} />
                        <Route path="analysis/:id/roadmap" element={<CareerRoadmap />} />
                    </Route>

                    {/* Catch all */}
                    <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;
