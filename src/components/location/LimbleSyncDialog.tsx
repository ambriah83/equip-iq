import React, { useState } from 'react';
import { RefreshCw, Check, AlertCircle, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { syncLocationsFromLimble, testLimbleConnection } from '@/services/limble-service';
import { useLocations } from '@/hooks/useLocations';

export const LimbleSyncDialog = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'untested' | 'success' | 'error'>('untested');
  const [syncResult, setSyncResult] = useState<any>(null);
  const { toast } = useToast();
  const { createLocation } = useLocations();

  const handleTestConnection = async () => {
    setIsTesting(true);
    try {
      const isConnected = await testLimbleConnection();
      setConnectionStatus(isConnected ? 'success' : 'error');
      
      if (!isConnected) {
        toast({
          title: "Connection Failed",
          description: "Unable to connect to Limble. Please check your API credentials.",
          variant: "destructive",
        });
      }
    } catch (error) {
      setConnectionStatus('error');
      toast({
        title: "Connection Error",
        description: "An error occurred while testing the connection.",
        variant: "destructive",
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleSync = async () => {
    setIsLoading(true);
    try {
      const result = await syncLocationsFromLimble();
      setSyncResult(result);
      
      if (result.success) {
        // Add each location to your database
        for (const location of result.locations) {
          try {
            await createLocation({
              name: location.name,
              address: `${location.address}, ${location.city}, ${location.state} ${location.zip}`,
              abbreviation: location.name.substring(0, 3).toUpperCase(),
              status: 'active',
              metadata: {
                limble_location_id: location.limble_location_id,
                synced_from_limble: true,
                sync_date: new Date().toISOString()
              }
            });
          } catch (error) {
            console.error(`Failed to create location ${location.name}:`, error);
          }
        }
        
        toast({
          title: "Sync Complete",
          description: `Successfully synced ${result.count} locations from Limble.`,
        });
        
        setTimeout(() => {
          setIsOpen(false);
          window.location.reload(); // Refresh to show new locations
        }, 2000);
      } else {
        toast({
          title: "Sync Failed",
          description: result.error || "Unable to sync locations from Limble.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Sync Error",
        description: "An unexpected error occurred during sync.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
          <RefreshCw size={16} />
          Sync from Limble
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Sync Locations from Limble</DialogTitle>
          <DialogDescription>
            Import your locations from Limble CMMS. This will add any new locations
            found in Limble to your EquipIQ database.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          {/* Connection Status */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center space-x-2">
              <span className="font-medium">Limble Connection:</span>
              {connectionStatus === 'untested' && (
                <span className="text-gray-500">Not tested</span>
              )}
              {connectionStatus === 'success' && (
                <span className="text-green-600 flex items-center">
                  <Check className="h-4 w-4 mr-1" /> Connected
                </span>
              )}
              {connectionStatus === 'error' && (
                <span className="text-red-600 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" /> Failed
                </span>
              )}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleTestConnection}
              disabled={isTesting}
            >
              {isTesting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                'Test Connection'
              )}
            </Button>
          </div>

          {/* Sync Info */}
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              This will:
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Fetch all locations from your Limble account</li>
                <li>Add new locations to EquipIQ</li>
                <li>Link locations with their Limble IDs for future syncing</li>
                <li>Not affect existing locations in EquipIQ</li>
              </ul>
            </AlertDescription>
          </Alert>

          {/* Sync Results */}
          {syncResult && (
            <Alert className={syncResult.success ? "border-green-200" : "border-red-200"}>
              <AlertDescription>
                {syncResult.success ? (
                  <div>
                    <p className="font-medium text-green-700">Sync successful!</p>
                    <p className="text-sm mt-1">
                      Found {syncResult.count} locations in Limble.
                    </p>
                  </div>
                ) : (
                  <div>
                    <p className="font-medium text-red-700">Sync failed</p>
                    <p className="text-sm mt-1">{syncResult.error}</p>
                  </div>
                )}
              </AlertDescription>
            </Alert>
          )}
        </div>

        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => setIsOpen(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSync}
            disabled={isLoading || connectionStatus !== 'success'}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Syncing...
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4 mr-2" />
                Start Sync
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};