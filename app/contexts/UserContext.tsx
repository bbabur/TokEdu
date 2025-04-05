import React, { createContext, useContext, useState } from 'react';

type UserType = {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
} | null;

type UserContextType = {
  user: UserType;
  setUser: (user: UserType) => void;
};

const UserContext = createContext<UserContextType>({
  user: null,
  setUser: () => {},
});

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserType>(null);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
