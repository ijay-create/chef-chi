import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export const useAdmin = (user) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdmin = async () => {
      if (!user) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      const { data } = await supabase
        .from("admins")
        .select("*")
        .eq("id", user.id)
        .single();

      setIsAdmin(!!data);
      setLoading(false);
    };

    checkAdmin();
  }, [user]);

  return { isAdmin, loading };
};