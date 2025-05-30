import { SystemEvent } from "@/types/game";

interface SystemEventLogProps {
  events: SystemEvent[];
}

export const SystemEventLog = ({ events }: SystemEventLogProps) => {
  const getEventColor = (type: string) => {
    switch (type) {
      case 'task_complete':
      case 'success':
        return 'text-green-400';
      case 'level_up':
      case 'achievement':
        return 'text-secondary';
      case 'reward':
      case 'spin':
        return 'text-blue-400';
      case 'penalty':
      case 'error':
        return 'text-red-400';
      default:
        return 'text-gray-300';
    }
  };

  const formatTime = (date: Date) => {
    return new Date(date).toTimeString().slice(0, 5);
  };

  return (
    <div className="fixed bottom-4 right-4 w-80 max-h-64 overflow-y-auto bg-dark-light/95 backdrop-blur-sm border border-primary-light/30 rounded-lg p-4 z-20">
      <h4 className="text-sm font-orbitron font-bold text-white mb-3 flex items-center">
        <i className="fas fa-scroll mr-2 text-accent"></i>
        System Log
      </h4>
      <div className="space-y-2 text-xs">
        {events.length === 0 ? (
          <div className="text-gray-500 text-center py-4">
            No events yet today...
          </div>
        ) : (
          events.map(event => (
            <div key={event.id} className={getEventColor(event.type)}>
              <span className="text-gray-500">[{formatTime(event.createdAt)}]</span> {event.message}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
