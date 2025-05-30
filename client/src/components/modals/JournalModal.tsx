import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useState } from "react";

interface JournalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitJournal: (entry: { wellToday: string; couldImprove: string }) => void;
}

export const JournalModal = ({ isOpen, onClose, onSubmitJournal }: JournalModalProps) => {
  const [wellToday, setWellToday] = useState("");
  const [couldImprove, setCouldImprove] = useState("");

  const handleSubmit = () => {
    if (wellToday.trim() || couldImprove.trim()) {
      onSubmitJournal({ wellToday, couldImprove });
      setWellToday("");
      setCouldImprove("");
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-dark-light border border-primary-light/30 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-orbitron font-bold text-white flex items-center">
            <i className="fas fa-book mr-3 text-purple-400"></i>
            Daily Journal
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="bg-purple-600/20 border border-purple-400/30 rounded-lg p-4">
            <p className="text-purple-400 text-sm text-center">
              <i className="fas fa-eye mr-2"></i>
              Completing your journal grants +1 WISDOM
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="wellToday" className="text-white font-medium">
                What went well today?
              </Label>
              <Textarea
                id="wellToday"
                value={wellToday}
                onChange={(e) => setWellToday(e.target.value)}
                placeholder="Reflect on your successes and positive moments..."
                className="mt-2 bg-primary/30 border-primary-light/30 text-white placeholder-gray-400"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="couldImprove" className="text-white font-medium">
                What could be improved?
              </Label>
              <Textarea
                id="couldImprove"
                value={couldImprove}
                onChange={(e) => setCouldImprove(e.target.value)}
                placeholder="Think about areas for growth and learning..."
                className="mt-2 bg-primary/30 border-primary-light/30 text-white placeholder-gray-400"
                rows={3}
              />
            </div>
          </div>

          <div className="flex space-x-3">
            <Button
              onClick={onClose}
              variant="outline"
              className="flex-1 bg-transparent border-gray-600 text-gray-300 hover:bg-gray-600/20"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!wellToday.trim() && !couldImprove.trim()}
              className="flex-1 bg-purple-600 hover:bg-purple-700 text-white disabled:opacity-50"
            >
              Save Entry (+1 WIS)
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
