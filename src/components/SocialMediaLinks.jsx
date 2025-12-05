import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const SocialMediaLinks = ({ socialMediaData, setSocialMediaData }) => {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSocialMediaData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="space-y-6 bg-cartaai-black/50 p-6 rounded-lg">
      <h2 className="text-2xl font-semibold text-cartaai-white border-b border-cartaai-white/10 pb-2">Enlaces de redes sociales</h2>
      
      <div className="space-y-4">
        <div>
          <Label htmlFor="facebook" className="text-cartaai-white">Facebook</Label>
          <Input
            id="facebook"
            name="facebook"
            type="text"
            value={socialMediaData.facebook}
            onChange={handleInputChange}
            className="bg-cartaai-white/10 text-cartaai-white mt-1"
            placeholder="https://www.facebook.com/turestaurante"
          />
        </div>

        <div>
          <Label htmlFor="twitter" className="text-cartaai-white">Twitter</Label>
          <Input
            id="twitter"
            name="twitter"
            type="text"
            value={socialMediaData.twitter}
            onChange={handleInputChange}
            className="bg-cartaai-white/10 text-cartaai-white mt-1"
            placeholder="https://www.twitter.com/turestaurante"
          />
        </div>

        <div>
          <Label htmlFor="youtube" className="text-cartaai-white">Youtube</Label>
          <Input
            id="youtube"
            name="youtube"
            type="text"
            value={socialMediaData.youtube}
            onChange={handleInputChange}
            className="bg-cartaai-white/10 text-cartaai-white mt-1"
            placeholder="https://www.youtube.com/turestaurante"
          />
        </div>

        <div>
          <Label htmlFor="instagram" className="text-cartaai-white">Instagram</Label>
          <Input
            id="instagram"
            name="instagram"
            type="text"
            value={socialMediaData.instagram}
            onChange={handleInputChange}
            className="bg-cartaai-white/10 text-cartaai-white mt-1"
            placeholder="https://www.instagram.com/turestaurante"
          />
        </div>
      </div>
    </div>
  );
};

export default SocialMediaLinks;