import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Box, Slider, Typography, Button } from '@mui/material';
import Cropper from 'react-easy-crop';

const ImageCropperDialog = ({ 
  open, 
  onClose, 
  imageSrc, 
  crop, 
  setCrop, 
  zoom, 
  setZoom, 
  onCropComplete, 
  onSave 
}) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Crop Image</DialogTitle>
      <DialogContent dividers>
        <Box
          sx={{
            position: 'relative',
            width: '100%',
            height: 300,
            background: '#333',
            borderRadius: 2,
            overflow: 'hidden',
          }}
        >
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={1}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
        </Box>
        <Box sx={{ mt: 3 }}>
          <Typography variant="body2" gutterBottom>Zoom</Typography>
          <Slider
            value={zoom}
            min={1}
            max={3}
            step={0.1}
            onChange={(e, value) => setZoom(value)}
            sx={{ color: '#4dd0e1' }}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button 
          onClick={onSave} 
          variant="contained" 
          sx={{ backgroundColor: '#4dd0e1', color: '#000' }}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ImageCropperDialog;
