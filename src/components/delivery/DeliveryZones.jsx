const handleZoneUpdated = (updatedZone) => {
  setZones(prev => prev.map(zone => 
    zone._id === updatedZone._id ? updatedZone : zone
  ));
  setIsEditModalOpen(false);
  setSelectedZone(null);
};