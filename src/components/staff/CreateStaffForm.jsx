import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, Mail, Phone, Lock, Shield } from "lucide-react";

const CreateStaffForm = ({ formData, handleInputChange, handleRoleChange, roles, isLoading }) => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name" className="text-cartaai-white">Nombre completo</Label>
        <div className="relative">
          <User className="absolute left-3 top-2.5 h-5 w-5 text-cartaai-white/50" />
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="glass-input text-cartaai-white pl-10 border-cartaai-white/20 focus:border-cartaai-red/50 focus:ring-cartaai-red/30"
            placeholder="Nombre y Apellido"
            required
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="email" className="text-cartaai-white">Correo electrónico</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-2.5 h-5 w-5 text-cartaai-white/50" />
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            className="glass-input text-cartaai-white pl-10 border-cartaai-white/20 focus:border-cartaai-red/50 focus:ring-cartaai-red/30"
            placeholder="correo@ejemplo.com"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone" className="text-cartaai-white">Teléfono</Label>
        <div className="relative">
          <Phone className="absolute left-3 top-2.5 h-5 w-5 text-cartaai-white/50" />
          <Input
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            className="glass-input text-cartaai-white pl-10 border-cartaai-white/20 focus:border-cartaai-red/50 focus:ring-cartaai-red/30"
            placeholder="123456789"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="password" className="text-cartaai-white">Contraseña</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-2.5 h-5 w-5 text-cartaai-white/50" />
          <Input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleInputChange}
            className="glass-input text-cartaai-white pl-10 border-cartaai-white/20 focus:border-cartaai-red/50 focus:ring-cartaai-red/30"
            placeholder="********"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="role" className="text-cartaai-white flex items-center gap-2">
          <Shield className="h-5 w-5 text-cartaai-white/50" />
          Rol
        </Label>
        <Select
          value={formData.role}
          onValueChange={handleRoleChange}
        >
          <SelectTrigger className="glass-input text-cartaai-white border-cartaai-white/20 focus:border-cartaai-red/50 focus:ring-cartaai-red/30">
            <SelectValue placeholder="Seleccionar rol" />
          </SelectTrigger>
          <SelectContent className="bg-cartaai-black border-cartaai-white/10">
            {roles.map((role) => (
              <SelectItem 
                key={role._id} 
                value={role._id}
                className="text-cartaai-white hover:bg-cartaai-white/10 focus:bg-cartaai-white/10"
              >
                {role.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default CreateStaffForm;