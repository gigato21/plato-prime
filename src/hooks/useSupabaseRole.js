import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

/**
 * Hook to check user roles from Supabase user_roles table
 * Uses the has_role database function for secure role checking
 */
export const useSupabaseRole = () => {
  const [user, setUser] = useState(null);
  const [roles, setRoles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isModerator, setIsModerator] = useState(false);

  const checkRole = useCallback(async (userId, role) => {
    try {
      const { data, error } = await supabase.rpc('has_role', {
        _user_id: userId,
        _role: role
      });

      if (error) {
        console.error(`Error checking ${role} role:`, error);
        return false;
      }

      return data === true;
    } catch (error) {
      console.error(`Error checking ${role} role:`, error);
      return false;
    }
  }, []);

  const loadUserRoles = useCallback(async (userId) => {
    try {
      // Fetch all roles for the user
      const { data: userRoles, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId);

      if (error) {
        console.error('Error fetching user roles:', error);
        return [];
      }

      return (userRoles || []).map(r => r.role);
    } catch (error) {
      console.error('Error loading user roles:', error);
      return [];
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    const initializeRoles = async () => {
      try {
        const { data: { user: currentUser } } = await supabase.auth.getUser();
        
        if (!isMounted) return;

        if (currentUser) {
          setUser(currentUser);

          // Check admin and moderator roles in parallel
          const [adminResult, moderatorResult, userRoles] = await Promise.all([
            checkRole(currentUser.id, 'admin'),
            checkRole(currentUser.id, 'moderator'),
            loadUserRoles(currentUser.id)
          ]);

          if (!isMounted) return;

          setIsAdmin(adminResult);
          setIsModerator(moderatorResult);
          setRoles(userRoles);
        } else {
          setUser(null);
          setIsAdmin(false);
          setIsModerator(false);
          setRoles([]);
        }
      } catch (error) {
        console.error('Error initializing roles:', error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session?.user) {
          // Defer role checking to avoid deadlocks
          setTimeout(() => {
            initializeRoles();
          }, 0);
        } else {
          setUser(null);
          setIsAdmin(false);
          setIsModerator(false);
          setRoles([]);
          setIsLoading(false);
        }
      }
    );

    // Initial check
    initializeRoles();

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [checkRole, loadUserRoles]);

  const hasRole = useCallback((role) => {
    return roles.includes(role);
  }, [roles]);

  const refetchRoles = useCallback(async () => {
    if (user) {
      setIsLoading(true);
      const [adminResult, moderatorResult, userRoles] = await Promise.all([
        checkRole(user.id, 'admin'),
        checkRole(user.id, 'moderator'),
        loadUserRoles(user.id)
      ]);
      setIsAdmin(adminResult);
      setIsModerator(moderatorResult);
      setRoles(userRoles);
      setIsLoading(false);
    }
  }, [user, checkRole, loadUserRoles]);

  return {
    user,
    roles,
    isLoading,
    isAdmin,
    isModerator,
    hasRole,
    refetchRoles
  };
};

export default useSupabaseRole;
