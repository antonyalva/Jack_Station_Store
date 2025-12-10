import { supabase } from './supabase';

export async function getUserRole(userId) {
    try {
        const { data, error } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', userId)
            .single();

        if (error) {
            console.error('Error fetching user role:', error);
            return null;
        }

        return data?.role;
    } catch (error) {
        console.error('Unexpected error fetching role:', error);
        return null;
    }
}
