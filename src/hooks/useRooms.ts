
import { useLocalStorage } from './useLocalStorage';
import { Room } from '@/types/Room';

export const useRooms = () => {
  const [rooms, setRooms] = useLocalStorage<Room[]>('rooms', []);

  const getRoomsByLocation = (locationId: string) => {
    return rooms.filter(room => room.locationId === locationId);
  };

  const getRoomById = (roomId: string) => {
    return rooms.find(room => room.id === roomId);
  };

  const addRoom = (room: Omit<Room, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newRoom: Room = {
      ...room,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setRooms(prev => [...prev, newRoom]);
    return newRoom;
  };

  const updateRoom = (roomId: string, updates: Partial<Room>) => {
    setRooms(prev => prev.map(room => 
      room.id === roomId 
        ? { ...room, ...updates, updatedAt: new Date().toISOString() }
        : room
    ));
  };

  const deleteRoom = (roomId: string) => {
    setRooms(prev => prev.filter(room => room.id !== roomId));
  };

  return {
    rooms,
    getRoomsByLocation,
    getRoomById,
    addRoom,
    updateRoom,
    deleteRoom
  };
};
