import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./ui/button";
import { Wind, X, Heart, BookOpen, MessageCircle, Sparkles } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";

interface FloatingActionButtonProps {
  onAction: (action: string) => void;
}

export function FloatingActionButton({ onAction }: FloatingActionButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  const actions = [
    { id: "breathing", label: "Quick Breathing", icon: Wind, color: "bg-blue-500 hover:bg-blue-600" },
    { id: "mood", label: "Track Mood", icon: Heart, color: "bg-pink-500 hover:bg-pink-600" },
    { id: "journal", label: "Quick Note", icon: BookOpen, color: "bg-purple-500 hover:bg-purple-600" },
    { id: "chat", label: "Talk to Companion", icon: MessageCircle, color: "bg-teal-500 hover:bg-teal-600" },
  ];

  return (
    <TooltipProvider>
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
        <AnimatePresence>
          {isOpen && (
            <>
              {actions.map((action, index) => (
                <motion.div
                  key={action.id}
                  initial={{ opacity: 0, scale: 0, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0, y: 20 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size="icon"
                        className={`h-12 w-12 rounded-full shadow-lg ${action.color}`}
                        onClick={() => {
                          onAction(action.id);
                          setIsOpen(false);
                        }}
                      >
                        <action.icon className="h-5 w-5 text-white" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="left">
                      <p>{action.label}</p>
                    </TooltipContent>
                  </Tooltip>
                </motion.div>
              ))}
            </>
          )}
        </AnimatePresence>

        {/* Main FAB */}
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            size="icon"
            className="h-14 w-14 rounded-full bg-primary shadow-lg hover:shadow-xl"
            onClick={() => setIsOpen(!isOpen)}
          >
            <motion.div
              animate={{ rotate: isOpen ? 45 : 0 }}
              transition={{ duration: 0.2 }}
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Sparkles className="h-6 w-6" />
              )}
            </motion.div>
          </Button>
        </motion.div>
      </div>
    </TooltipProvider>
  );
}
