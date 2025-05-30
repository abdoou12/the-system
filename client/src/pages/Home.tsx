import { Header } from "@/components/Header";
import { DailyTasks } from "@/components/DailyTasks";
import { DailyEvents } from "@/components/DailyEvents";
import { ActiveChallenges } from "@/components/ActiveChallenges";
import { CharacterStats } from "@/components/CharacterStats";
import { Achievements } from "@/components/Achievements";
import { QuickActions } from "@/components/QuickActions";
import { SystemEventLog } from "@/components/SystemEventLog";
import { LevelUpModal } from "@/components/LevelUpModal";
import { ShopModal } from "@/components/modals/ShopModal";
import { JournalModal } from "@/components/modals/JournalModal";
import { DailySpinModal } from "@/components/modals/DailySpinModal";
import { useGameState } from "@/hooks/useGameState";
import { isSpinAvailable } from "@/lib/gameLogic";
import { useToast } from "@/hooks/use-toast";

export default function Home() {
  const { 
    gameState, 
    toggleTask, 
    submitDay, 
    performDailySpin, 
    openModal, 
    closeModal, 
    spendAttributePoint,
    addSystemEvent
  } = useGameState();
  
  const { toast } = useToast();

  const handlePurchase = (item: any) => {
    if (gameState.user.gold >= item.price) {
      // Handle purchase logic here
      addSystemEvent(`Purchased ${item.name} for ${item.price} gold`, 'purchase');
      toast({
        title: "Purchase Successful!",
        description: `You bought ${item.name}`,
      });
    } else {
      toast({
        title: "Insufficient Gold",
        description: "You don't have enough gold for this item",
        variant: "destructive"
      });
    }
  };

  const handleJournalSubmit = (entry: { wellToday: string; couldImprove: string }) => {
    // Update wisdom stat
    spendAttributePoint('wis');
    addSystemEvent('Journal entry saved: +1 WISDOM', 'journal');
    toast({
      title: "Journal Saved!",
      description: "+1 WISDOM gained",
    });
  };

  const handleSpinResult = () => {
    const result = performDailySpin();
    if (result) {
      toast({
        title: "Spin Complete!",
        description: result.message,
      });
    }
    return result;
  };

  const canSpin = isSpinAvailable(gameState.user.lastSpinDate);

  return (
    <div className="bg-dark min-h-screen text-gray-100 font-inter">
      {/* Background Pattern */}
      <div className="fixed inset-0 opacity-5 pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: "radial-gradient(circle at 25% 25%, #7209b7 0%, transparent 50%), radial-gradient(circle at 75% 75%, #00d4ff 0%, transparent 50%)"
        }}></div>
      </div>

      <Header user={gameState.user} />

      <main className="container mx-auto px-4 py-8 relative z-10">
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Main Panel */}
          <div className="lg:col-span-2 space-y-6">
            <DailyTasks 
              tasks={gameState.tasks}
              onToggleTask={toggleTask}
              onSubmitDay={submitDay}
            />
            
            <DailyEvents 
              dailyEvent={gameState.dailyEvent}
              onDailySpin={() => openModal('dailySpin')}
              canSpin={canSpin}
            />
            
            <ActiveChallenges activeBoss={gameState.activeBoss} />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <CharacterStats 
              user={gameState.user}
              onAllocateAttributes={() => addSystemEvent('Attribute allocation panel opened', 'info')}
              onSpendAttributePoint={spendAttributePoint}
            />
            
            <Achievements 
              achievements={gameState.achievements}
              onViewAll={() => addSystemEvent('Achievements panel opened', 'info')}
            />
            
            <QuickActions 
              onOpenShop={() => openModal('shop')}
              onOpenJournal={() => openModal('journal')}
              onOpenHistory={() => addSystemEvent('History panel opened', 'info')}
              onOpenDungeon={() => addSystemEvent('Dungeon accessed', 'info')}
            />
          </div>
        </div>
      </main>

      <SystemEventLog events={gameState.events} />

      {/* Modals */}
      <LevelUpModal
        isOpen={gameState.modals.levelUp}
        onClose={() => closeModal('levelUp')}
        newLevel={gameState.user.level}
        attributePoints={3}
        hpIncrease={10}
        goldReward={25}
      />

      <ShopModal
        isOpen={gameState.modals.shop}
        onClose={() => closeModal('shop')}
        userGold={gameState.user.gold}
        onPurchase={handlePurchase}
      />

      <JournalModal
        isOpen={gameState.modals.journal}
        onClose={() => closeModal('journal')}
        onSubmitJournal={handleJournalSubmit}
      />

      <DailySpinModal
        isOpen={gameState.modals.dailySpin}
        onClose={() => closeModal('dailySpin')}
        onSpin={handleSpinResult}
      />
    </div>
  );
}
