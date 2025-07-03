import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  role: 'customer' | 'company';
  name: string;
  phone?: string;
  address?: string;
}

interface WasteRequest {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  wasteType: string;
  quantity: string;
  location: string;
  description: string;
  images: string[];
  status: 'pending' | 'accepted' | 'completed';
  createdAt: string;
}

interface NearbyCompany {
  id: string;
  name: string;
  distance: string;
  rating: number;
  services: string[];
}

interface AuthContextType {
  user: User | null;
  wasteRequests: WasteRequest[];
  nearbyCompanies: NearbyCompany[];
  login: (email: string, password: string, role: 'customer' | 'company') => Promise<boolean>;
  signup: (email: string, password: string, name: string, role: 'customer' | 'company', phone?: string, address?: string) => Promise<boolean>;
  logout: () => void;
  addWasteRequest: (request: Omit<WasteRequest, 'id' | 'customerId' | 'customerName' | 'customerEmail' | 'createdAt' | 'status'>) => void;
  updateRequestStatus: (requestId: string, status: 'accepted' | 'completed') => void;
  deleteWasteRequest: (requestId: string) => void;
  updateNearbyCompanies: (location: { lat: number; lng: number }) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [wasteRequests, setWasteRequests] = useState<WasteRequest[]>([]);
  const [nearbyCompanies, setNearbyCompanies] = useState<NearbyCompany[]>([]);

  // Mock function to calculate distance and update companies based on location
  const updateNearbyCompanies = (location: { lat: number; lng: number }) => {
    // In a real app, this would make an API call with the user's coordinates
    // For now, we'll simulate different companies based on mock location
    const mockCompanies: NearbyCompany[] = [
      {
        id: '1',
        name: 'EcoClean Solutions',
        distance: `${(Math.random() * 3 + 1).toFixed(1)} km`,
        rating: 4.8,
        services: ['Electronic Waste', 'Plastic Waste', 'Metal Waste']
      },
      {
        id: '2',
        name: 'GreenWaste Recyclers',
        distance: `${(Math.random() * 3 + 2).toFixed(1)} km`,
        rating: 4.6,
        services: ['Organic Waste', 'Paper Waste', 'Glass Waste']
      },
      {
        id: '3',
        name: 'WasteCare Pro',
        distance: `${(Math.random() * 3 + 3).toFixed(1)} km`,
        rating: 4.7,
        services: ['Electronic Waste', 'Hazardous Waste', 'Bulk Waste']
      },
      {
        id: '4',
        name: 'RecycleMaster Inc',
        distance: `${(Math.random() * 3 + 4).toFixed(1)} km`,
        rating: 4.5,
        services: ['All Types', 'Pickup Service', '24/7 Available']
      },
      {
        id: '5',
        name: 'Local Waste Solutions',
        distance: `${(Math.random() * 2 + 0.5).toFixed(1)} km`,
        rating: 4.9,
        services: ['Residential Pickup', 'Commercial Waste', 'Recycling']
      }
    ];

    // Sort by distance (simulate closer companies first)
    const sortedCompanies = mockCompanies.sort((a, b) => 
      parseFloat(a.distance) - parseFloat(b.distance)
    );

    setNearbyCompanies(sortedCompanies);
  };

  // Load data from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('wasteApp_user');
    const savedRequests = localStorage.getItem('wasteApp_requests');
    
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    
    if (savedRequests) {
      setWasteRequests(JSON.parse(savedRequests));
    }
  }, []);

  // Save requests to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('wasteApp_requests', JSON.stringify(wasteRequests));
  }, [wasteRequests]);

  const login = async (email: string, password: string, role: 'customer' | 'company'): Promise<boolean> => {
    // Simulate API call
    const savedUsers = JSON.parse(localStorage.getItem('wasteApp_users') || '[]');
    const foundUser = savedUsers.find((u: any) => u.email === email && u.role === role);
    
    if (foundUser) {
      const user = { 
        id: foundUser.id, 
        email: foundUser.email, 
        role: foundUser.role, 
        name: foundUser.name,
        phone: foundUser.phone,
        address: foundUser.address
      };
      setUser(user);
      localStorage.setItem('wasteApp_user', JSON.stringify(user));
      return true;
    }
    return false;
  };

  const signup = async (email: string, password: string, name: string, role: 'customer' | 'company', phone?: string, address?: string): Promise<boolean> => {
    // Simulate API call
    const savedUsers = JSON.parse(localStorage.getItem('wasteApp_users') || '[]');
    const existingUser = savedUsers.find((u: any) => u.email === email);
    
    if (!existingUser) {
      const newUser = { 
        id: Date.now().toString(), 
        email, 
        name, 
        role,
        phone,
        address,
        password // In real app, this would be hashed
      };
      savedUsers.push(newUser);
      localStorage.setItem('wasteApp_users', JSON.stringify(savedUsers));
      
      const user = { 
        id: newUser.id, 
        email: newUser.email, 
        role: newUser.role, 
        name: newUser.name,
        phone: newUser.phone,
        address: newUser.address
      };
      setUser(user);
      localStorage.setItem('wasteApp_user', JSON.stringify(user));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('wasteApp_user');
  };

  const addWasteRequest = (request: Omit<WasteRequest, 'id' | 'customerId' | 'customerName' | 'customerEmail' | 'createdAt' | 'status'>) => {
    if (!user || user.role !== 'customer') return;
    
    const newRequest: WasteRequest = {
      ...request,
      id: Date.now().toString(),
      customerId: user.id,
      customerName: user.name,
      customerEmail: user.email,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    
    setWasteRequests(prev => [...prev, newRequest]);
  };

  const updateRequestStatus = (requestId: string, status: 'accepted' | 'completed') => {
    setWasteRequests(prev => 
      prev.map(request => 
        request.id === requestId ? { ...request, status } : request
      )
    );
  };

  const deleteWasteRequest = (requestId: string) => {
    setWasteRequests(prev => prev.filter(request => request.id !== requestId));
  };

  return (
    <AuthContext.Provider value={{
      user,
      wasteRequests,
      nearbyCompanies,
      login,
      signup,
      logout,
      addWasteRequest,
      updateRequestStatus,
      deleteWasteRequest,
      updateNearbyCompanies
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
