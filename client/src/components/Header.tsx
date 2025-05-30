import { UserState } from "@/types/game";

interface HeaderProps {
  user: UserState;
}

export const Header = ({ user }: HeaderProps) => {
  return (
    <header className="relative z-10 bg-primary border-b border-primary-light/30">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-secondary to-primary-light rounded-lg flex items-center justify-center animate-glow">
              <i className="fas fa-crown text-2xl text-white"></i>
            </div>
            <div>
              <h1 className="text-2xl font-orbitron font-bold text-white">Solo Leveling</h1>
              <p className="text-sm text-gray-400">Habit Tracker System</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <i className="fas fa-coins text-secondary"></i>
              <span className="font-semibold text-secondary">{user.gold.toLocaleString()}</span>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-400">Level {user.level}</div>
              <div className="text-lg font-orbitron font-bold text-accent">{user.title}</div>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-accent to-primary-light rounded-full flex items-center justify-center border-2 border-accent/50">
              <i className="fas fa-user text-white"></i>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
