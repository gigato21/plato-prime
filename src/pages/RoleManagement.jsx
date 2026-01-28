import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Shield, UserPlus, Trash2, Loader2, Search, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

const ROLES = ['admin', 'moderator', 'user'];

const RoleManagement = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [userRoles, setUserRoles] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [assigningRole, setAssigningRole] = useState(null);
  const [removingRole, setRemovingRole] = useState(null);

  useEffect(() => {
    checkAdminAccess();
  }, []);

  const checkAdminAccess = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error('Debes iniciar sesión');
        navigate('/auth');
        return;
      }

      setCurrentUserId(user.id);

      // Check if user has admin role using the has_role function
      const { data: hasAdminRole, error } = await supabase.rpc('has_role', {
        _user_id: user.id,
        _role: 'admin'
      });

      if (error) {
        console.error('Error checking admin role:', error);
        toast.error('Error al verificar permisos');
        navigate('/');
        return;
      }

      if (!hasAdminRole) {
        toast.error('No tienes permisos de administrador');
        navigate('/');
        return;
      }

      setIsAdmin(true);
      await loadUsersAndRoles();
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al verificar acceso');
      navigate('/');
    }
  };

  const loadUsersAndRoles = async () => {
    setIsLoading(true);
    try {
      // Load all profiles
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (profilesError) throw profilesError;

      setUsers(profiles || []);

      // Load all user roles (admin can see all)
      const { data: roles, error: rolesError } = await supabase
        .from('user_roles')
        .select('*');

      if (rolesError) throw rolesError;

      // Group roles by user_id
      const rolesMap = {};
      (roles || []).forEach(role => {
        if (!rolesMap[role.user_id]) {
          rolesMap[role.user_id] = [];
        }
        rolesMap[role.user_id].push(role);
      });

      setUserRoles(rolesMap);
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Error al cargar usuarios');
    } finally {
      setIsLoading(false);
    }
  };

  const assignRole = async (userId, role) => {
    setAssigningRole(`${userId}-${role}`);
    try {
      // Check if role already exists
      const existingRoles = userRoles[userId] || [];
      if (existingRoles.some(r => r.role === role)) {
        toast.info('El usuario ya tiene este rol');
        return;
      }

      const { error } = await supabase
        .from('user_roles')
        .insert({ user_id: userId, role });

      if (error) throw error;

      toast.success(`Rol ${role} asignado correctamente`);
      await loadUsersAndRoles();
    } catch (error) {
      console.error('Error assigning role:', error);
      toast.error('Error al asignar rol');
    } finally {
      setAssigningRole(null);
    }
  };

  const removeRole = async (roleId, userId) => {
    // Prevent removing own admin role
    if (userId === currentUserId) {
      const roleToRemove = userRoles[userId]?.find(r => r.id === roleId);
      if (roleToRemove?.role === 'admin') {
        toast.error('No puedes remover tu propio rol de administrador');
        return;
      }
    }

    setRemovingRole(roleId);
    try {
      const { error } = await supabase
        .from('user_roles')
        .delete()
        .eq('id', roleId);

      if (error) throw error;

      toast.success('Rol removido correctamente');
      await loadUsersAndRoles();
    } catch (error) {
      console.error('Error removing role:', error);
      toast.error('Error al remover rol');
    } finally {
      setRemovingRole(null);
    }
  };

  const getRoleBadgeVariant = (role) => {
    switch (role) {
      case 'admin': return 'destructive';
      case 'moderator': return 'default';
      case 'user': return 'secondary';
      default: return 'outline';
    }
  };

  const filteredUsers = users.filter(user => {
    const searchLower = searchTerm.toLowerCase();
    return (
      user.name?.toLowerCase().includes(searchLower) ||
      user.email?.toLowerCase().includes(searchLower)
    );
  });

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="container mx-auto p-4 md:p-6 max-w-6xl"
    >
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
            <Shield className="h-7 w-7 text-primary" />
            Gestión de Roles
          </h1>
          <p className="text-muted-foreground">Administra los permisos de los usuarios</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Usuarios Registrados</CardTitle>
          <CardDescription>
            Asigna o remueve roles para controlar el acceso a diferentes funcionalidades
          </CardDescription>
          <div className="relative mt-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nombre o email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {searchTerm ? 'No se encontraron usuarios' : 'No hay usuarios registrados'}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Usuario</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Roles Actuales</TableHead>
                    <TableHead>Asignar Rol</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">
                        {user.name || 'Sin nombre'}
                        {user.user_id === currentUserId && (
                          <Badge variant="outline" className="ml-2 text-xs">Tú</Badge>
                        )}
                      </TableCell>
                      <TableCell>{user.email || 'Sin email'}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {(userRoles[user.user_id] || []).length === 0 ? (
                            <span className="text-muted-foreground text-sm">Sin roles</span>
                          ) : (
                            userRoles[user.user_id].map((role) => (
                              <div key={role.id} className="flex items-center gap-1">
                                <Badge variant={getRoleBadgeVariant(role.role)}>
                                  {role.role}
                                </Badge>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-5 w-5"
                                  onClick={() => removeRole(role.id, user.user_id)}
                                  disabled={removingRole === role.id}
                                >
                                  {removingRole === role.id ? (
                                    <Loader2 className="h-3 w-3 animate-spin" />
                                  ) : (
                                    <Trash2 className="h-3 w-3 text-destructive" />
                                  )}
                                </Button>
                              </div>
                            ))
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Select
                            onValueChange={(role) => assignRole(user.user_id, role)}
                            disabled={assigningRole?.startsWith(user.user_id)}
                          >
                            <SelectTrigger className="w-[130px]">
                              <SelectValue placeholder="Seleccionar" />
                            </SelectTrigger>
                            <SelectContent>
                              {ROLES.map((role) => (
                                <SelectItem key={role} value={role}>
                                  {role}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {assigningRole?.startsWith(user.user_id) && (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Descripción de Roles</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="p-4 border rounded-lg">
              <Badge variant="destructive" className="mb-2">admin</Badge>
              <p className="text-sm text-muted-foreground">
                Acceso completo al sistema. Puede gestionar usuarios, roles y todas las configuraciones.
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <Badge variant="default" className="mb-2">moderator</Badge>
              <p className="text-sm text-muted-foreground">
                Puede moderar contenido y gestionar usuarios básicos. Sin acceso a configuraciones críticas.
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <Badge variant="secondary" className="mb-2">user</Badge>
              <p className="text-sm text-muted-foreground">
                Usuario estándar con acceso básico a las funcionalidades de la aplicación.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default RoleManagement;
