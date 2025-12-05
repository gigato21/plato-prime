import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

const LoginPage = () => {
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // Simplemente navegar al dashboard sin verificar credenciales
    navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cartaai-black">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <img src="/carta-ai-logo.png" alt="Carta AI Logo" className="mx-auto h-20 w-auto" />
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="bg-cartaai-white/10 text-cartaai-white border-cartaai-white/20"
                placeholder="Correo electrónico"
              />
            </div>
            <div>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="bg-cartaai-white/10 text-cartaai-white border-cartaai-white/20 mt-2"
                placeholder="Contraseña"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Checkbox id="remember-me" className="h-4 w-4 text-cartaai-red focus:ring-cartaai-red" />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-cartaai-white">
                Acuérdate de mí
              </label>
            </div>

            <div className="text-sm">
              <a href="#" className="font-medium text-cartaai-red hover:text-cartaai-red/80">
                ¿Ha olvidado su contraseña?
              </a>
            </div>
          </div>

          <div>
            <Button
              type="submit"
              className="w-full bg-cartaai-red hover:bg-cartaai-red/80 text-white"
            >
              Iniciar sesión
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;