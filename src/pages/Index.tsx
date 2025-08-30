import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

interface QRSubmission {
  id: string;
  qrImage: string;
  telegramUsername: string;
  timestamp: Date;
}

const Index = () => {
  const [qrFile, setQrFile] = useState<File | null>(null);
  const [qrPreview, setQrPreview] = useState<string>('');
  const [telegramUsername, setTelegramUsername] = useState('');
  const [submissions, setSubmissions] = useState<QRSubmission[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setQrFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setQrPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (qrFile && telegramUsername) {
      const newSubmission: QRSubmission = {
        id: Date.now().toString(),
        qrImage: qrPreview,
        telegramUsername: telegramUsername.replace('@', ''),
        timestamp: new Date(),
      };
      setSubmissions(prev => [...prev, newSubmission]);
      
      // Reset form
      setQrFile(null);
      setQrPreview('');
      setTelegramUsername('');
      
      // Reset file input
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    }
  };

  return (
    <div className="min-h-screen bg-cyber-black cyber-grid">
      {/* Header */}
      <div className="border-b border-neon-green/20 bg-cyber-black/90 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Icon name="QrCode" size={32} className="text-neon-green animate-glow" />
              <h1 className="text-2xl font-bold text-white neon-text" style={{'--glow-color': '#00ff41'} as React.CSSProperties}>
                QR COLLECTOR
              </h1>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="border-neon-green text-neon-green">
                {submissions.length} QR кодов
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsAdmin(!isAdmin)}
                className="border-neon-pink text-neon-pink hover:bg-neon-pink/10"
              >
                <Icon name="Shield" size={16} />
                {isAdmin ? 'Пользователь' : 'Админ'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <Tabs defaultValue="upload" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-cyber-gray border border-neon-green/20">
            <TabsTrigger value="upload" className="data-[state=active]:bg-neon-green/20 data-[state=active]:text-neon-green">
              <Icon name="Upload" size={16} className="mr-2" />
              Загрузить QR
            </TabsTrigger>
            <TabsTrigger 
              value="admin" 
              className="data-[state=active]:bg-neon-pink/20 data-[state=active]:text-neon-pink"
              disabled={!isAdmin}
            >
              <Icon name="Database" size={16} className="mr-2" />
              База QR кодов
            </TabsTrigger>
          </TabsList>

          {/* Upload Tab */}
          <TabsContent value="upload" className="mt-6">
            <Card className="bg-cyber-gray/50 border-neon-green/30 neon-border animate-fade-in">
              <CardHeader className="text-center pb-6">
                <CardTitle className="text-2xl text-white neon-text flex items-center justify-center space-x-3">
                  <Icon name="QrCode" size={24} className="text-neon-green" />
                  <span>Отправить QR-код</span>
                </CardTitle>
                <p className="text-gray-400 mt-2">
                  Загрузите QR-код и укажите ваш Telegram username
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* File Upload */}
                  <div className="space-y-2">
                    <Label htmlFor="qr-upload" className="text-neon-green font-medium">
                      QR-код изображение
                    </Label>
                    <div className="border-2 border-dashed border-neon-green/30 rounded-lg p-8 text-center hover:border-neon-green/50 transition-colors">
                      <input
                        id="qr-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                      <label htmlFor="qr-upload" className="cursor-pointer">
                        {qrPreview ? (
                          <div className="space-y-4">
                            <img 
                              src={qrPreview} 
                              alt="QR Preview" 
                              className="mx-auto max-w-48 max-h-48 rounded border border-neon-green/30"
                            />
                            <p className="text-neon-green">QR-код загружен</p>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            <Icon name="Upload" size={48} className="mx-auto text-neon-green/50" />
                            <div>
                              <p className="text-white">Нажмите для загрузки QR-кода</p>
                              <p className="text-gray-400 text-sm mt-1">PNG, JPG до 10MB</p>
                            </div>
                          </div>
                        )}
                      </label>
                    </div>
                  </div>

                  {/* Telegram Username */}
                  <div className="space-y-2">
                    <Label htmlFor="telegram" className="text-neon-green font-medium">
                      Telegram username
                    </Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neon-green">
                        @
                      </span>
                      <Input
                        id="telegram"
                        type="text"
                        placeholder="yourusername"
                        value={telegramUsername}
                        onChange={(e) => setTelegramUsername(e.target.value)}
                        className="pl-8 bg-cyber-black border-neon-green/30 text-white placeholder:text-gray-500 focus:border-neon-green"
                        required
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <Button 
                    type="submit" 
                    disabled={!qrFile || !telegramUsername}
                    className="w-full bg-neon-green text-cyber-black hover:bg-neon-green/80 font-bold text-lg py-6 animate-glow"
                    style={{'--glow-color': '#00ff41'} as React.CSSProperties}
                  >
                    <Icon name="Send" size={20} className="mr-2" />
                    Отправить QR-код
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Admin Tab */}
          <TabsContent value="admin" className="mt-6">
            <Card className="bg-cyber-gray/50 border-neon-pink/30 neon-border animate-fade-in">
              <CardHeader>
                <CardTitle className="text-2xl text-white neon-text flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Icon name="Database" size={24} className="text-neon-pink" />
                    <span>База QR-кодов</span>
                  </div>
                  <Badge variant="outline" className="border-neon-pink text-neon-pink">
                    Всего: {submissions.length}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {submissions.length === 0 ? (
                  <div className="text-center py-12 text-gray-400">
                    <Icon name="Database" size={64} className="mx-auto mb-4 opacity-50" />
                    <p>QR-коды пока не загружены</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {submissions.map((submission) => (
                      <Card key={submission.id} className="bg-cyber-black/50 border-neon-pink/20 hover:border-neon-pink/50 transition-all hover:animate-glow">
                        <CardContent className="p-4">
                          <div className="space-y-3">
                            <img 
                              src={submission.qrImage} 
                              alt="QR Code" 
                              className="w-full aspect-square object-cover rounded border border-neon-pink/30"
                            />
                            <div className="space-y-2">
                              <div className="flex items-center space-x-2">
                                <Icon name="User" size={16} className="text-neon-pink" />
                                <span className="text-white font-mono">@{submission.telegramUsername}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Icon name="Clock" size={16} className="text-gray-400" />
                                <span className="text-gray-400 text-sm">
                                  {submission.timestamp.toLocaleString('ru-RU')}
                                </span>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Stats Footer */}
      <div className="border-t border-neon-green/20 bg-cyber-black/90 backdrop-blur-sm mt-12">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex justify-center space-x-8 text-sm">
            <div className="flex items-center space-x-2">
              <Icon name="Upload" size={16} className="text-neon-green" />
              <span className="text-gray-400">Загружено:</span>
              <span className="text-neon-green font-bold">{submissions.length}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Icon name="Users" size={16} className="text-neon-pink" />
              <span className="text-gray-400">Пользователей:</span>
              <span className="text-neon-pink font-bold">
                {new Set(submissions.map(s => s.telegramUsername)).size}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Icon name="Activity" size={16} className="text-white" />
              <span className="text-gray-400">Статус:</span>
              <span className="text-white font-bold">ОНЛАЙН</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;