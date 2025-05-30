import { DailyEvent } from "@/types/game";
import { Button } from "@/components/ui/button";

interface DailyEventsProps {
  dailyEvent: DailyEvent | null;
  onDailySpin: () => void;
  canSpin: boolean;
}

export const DailyEvents = ({ dailyEvent, onDailySpin, canSpin }: DailyEventsProps) => {
  const getEventStyle = (type: DailyEvent['type']) => {
    switch (type) {
      case 'blessing':
        return 'bg-success/20 border-success/40 text-success';
      case 'curse':
        return 'bg-destructive/20 border-destructive/40 text-destructive';
      default:
        return 'bg-muted/20 border-muted/40 text-muted-foreground';
    }
  };

  return (
    <div className="bg-dark-light/80 backdrop-blur-sm rounded-xl border border-primary-light/30 p-6">
      <h3 className="text-lg font-orbitron font-bold text-white mb-4 flex items-center">
        <i className="fas fa-dice mr-3 text-secondary"></i>
        Daily Events
      </h3>
      
      {dailyEvent && (
        <div className={`${getEventStyle(dailyEvent.type)} rounded-lg p-4 mb-4`}>
          <div className="flex items-center">
            <span className="mr-3 text-lg">{dailyEvent.icon}</span>
            <div>
              <p className="font-semibold">{dailyEvent.name}</p>
              <p className="text-sm opacity-90">{dailyEvent.description}</p>
            </div>
          </div>
        </div>
      )}

      <Button 
        onClick={onDailySpin}
        disabled={!canSpin}
        className="w-full bg-gradient-to-r from-purple-600 to-accent hover:from-purple-700 hover:to-accent/80 text-white font-semibold py-3 px-4 rounded-lg transition-all flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <i className="fas fa-sync-alt"></i>
        <span>{canSpin ? 'Daily Spin Available' : 'Spin Used Today'}</span>
      </Button>
    </div>
  );
};
