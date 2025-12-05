import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const SignupForm = ({ onSubmit, isLoading }) => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    mode: "onChange"
  });
  const password = watch("password", "");

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-sm font-medium">Nombre</Label>
          <Input 
            {...register('name', { required: 'El nombre es requerido' })} 
            className="glass-input h-11"
            placeholder="Tu nombre completo"
          />
          {errors.name && (
            <span className="text-xs text-destructive">{errors.name.message}</span>
          )}
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium">Email</Label>
          <Input 
            {...register('email', { 
              required: 'El email es requerido',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Email inválido"
              }
            })} 
            type="email"
            className="glass-input h-11"
            placeholder="ejemplo@email.com"
          />
          {errors.email && (
            <span className="text-xs text-destructive">{errors.email.message}</span>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium">Teléfono</Label>
        <Input 
          {...register('phone', { 
            required: 'El teléfono es requerido',
            pattern: {
              value: /^\d{9,}$/,
              message: "Teléfono inválido"
            }
          })} 
          type="tel"
          className="glass-input h-11"
          placeholder="Número de teléfono"
        />
        {errors.phone && (
          <span className="text-xs text-destructive">{errors.phone.message}</span>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-sm font-medium">Contraseña</Label>
          <Input 
            {...register('password', { 
              required: 'La contraseña es requerida',
              minLength: {
                value: 8,
                message: 'La contraseña debe tener al menos 8 caracteres'
              }
            })} 
            type="password"
            className="glass-input h-11"
            placeholder="••••••••"
          />
          {errors.password && (
            <span className="text-xs text-destructive">{errors.password.message}</span>
          )}
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium">Confirmar Contraseña</Label>
          <Input 
            {...register('confirmPassword', { 
              required: 'Por favor confirme la contraseña',
              validate: value => 
                value === password || 'Las contraseñas no coinciden'
            })} 
            type="password"
            className="glass-input h-11"
            placeholder="••••••••"
          />
          {errors.confirmPassword && (
            <span className="text-xs text-destructive">{errors.confirmPassword.message}</span>
          )}
        </div>
      </div>

      <Button 
        type="submit" 
        className="w-full bg-cartaai-red hover:bg-cartaai-red/90 text-white h-11 transition-all"
        disabled={isLoading}
      >
        {isLoading ? "Registrando..." : "Registrarse"}
      </Button>
    </form>
  );
};

export default SignupForm;