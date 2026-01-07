import { CameraView, useCameraPermissions } from 'expo-camera';
import { useState, useEffect, useRef, useCallback } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View, Platform, Alert } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { fetchProductByBarcode } from '@/services/barcodeService';

export default function ScannerScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [facing, setFacing] = useState<'back' | 'front'>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [cameraReady, setCameraReady] = useState(false);
  const cameraRef = useRef<CameraView>(null);

  // Activate camera when screen is focused, deactivate when leaving
  useFocusEffect(
    useCallback(() => {
      setIsActive(true);
      setCameraReady(false);
      return () => {
        setIsActive(false);
      };
    }, [])
  );

  // Try using the modern native barcode scanner if available
  const tryModernScanner = async () => {
    if (CameraView.isModernBarcodeScannerAvailable) {
      try {
        const subscription = CameraView.onModernBarcodeScanned(async (result) => {
          if (result.data) {
            subscription.remove();
            await CameraView.dismissScanner();
            handleBarcodeData(result.data);
          }
        });

        await CameraView.launchScanner({
          barcodeTypes: ['qr', 'ean13', 'ean8', 'upc_a', 'upc_e', 'code128', 'code39'],
        });
      } catch (error) {
        console.log('Modern scanner error:', error);
        // Fall back to CameraView
      }
    }
  };

  const handleBarcodeData = async (data: string) => {
    if (scanned) return;
    setScanned(true);

    try {
      const result = await fetchProductByBarcode(data);
      router.replace({
        pathname: '/(app)/scan-result',
        params: {
          barcode: data,
          found: result.found ? 'true' : 'false',
          product: result.product ? JSON.stringify(result.product) : '',
          ingredientsText: result.ingredientsText || '',
        },
      } as any);
    } catch (error) {
      Alert.alert('Error', 'Failed to look up product. Please try again.');
      setScanned(false);
    }
  };

  const handleBarcodeScanned = async ({ data }: { data: string }) => {
    handleBarcodeData(data);
  };

  const onCameraReady = () => {
    setCameraReady(true);
  };

  // Loading
  if (!permission) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Loading camera...</Text>
      </View>
    );
  }

  // No permission
  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>No access to camera</Text>
        <Button onPress={requestPermission} title="Grant Permission" />
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.text}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }

  return (
    <View style={styles.container}>
      {isActive && (
        <CameraView
          ref={cameraRef}
          style={StyleSheet.absoluteFillObject}
          facing={facing}
          onCameraReady={onCameraReady}
          barcodeScannerSettings={{
            barcodeTypes: ['qr', 'ean13', 'ean8', 'upc_a', 'upc_e', 'code128', 'code39'],
          }}
          onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
        />
      )}

      {/* Overlay UI */}
      <View style={styles.overlay} pointerEvents="box-none">
        {/* Top bar */}
        <View style={[styles.topBar, { paddingTop: insets.top }]}>
          <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn}>
            <Ionicons name="close" size={28} color="white" />
          </TouchableOpacity>
          <Text style={styles.title}>Scan Barcode</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Status indicator */}
        <View style={styles.statusBox}>
          <Text style={styles.statusText}>
            {!cameraReady ? 'Starting camera...' : 'Camera ready - point at barcode'}
          </Text>
        </View>

        {/* Center frame */}
        <View style={styles.frameContainer}>
          <View style={styles.frame}>
            <View style={[styles.corner, styles.topLeft]} />
            <View style={[styles.corner, styles.topRight]} />
            <View style={[styles.corner, styles.bottomLeft]} />
            <View style={[styles.corner, styles.bottomRight]} />
          </View>
          <Text style={styles.hintText}>Align barcode in frame</Text>
        </View>

        {/* Bottom controls */}
        <View style={[styles.bottomBar, { paddingBottom: insets.bottom + 20 }]}>
          <TouchableOpacity style={styles.flipBtn} onPress={toggleCameraFacing}>
            <Ionicons name="camera-reverse" size={28} color="white" />
          </TouchableOpacity>

          {/* Option to use native scanner */}
          {CameraView.isModernBarcodeScannerAvailable && (
            <TouchableOpacity style={styles.nativeScanBtn} onPress={tryModernScanner}>
              <Ionicons name="scan" size={24} color="white" />
              <Text style={styles.nativeScanText}>Use Native Scanner</Text>
            </TouchableOpacity>
          )}

          {scanned && (
            <TouchableOpacity onPress={() => setScanned(false)}>
              <Text style={styles.text}>Tap to Scan Again</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'transparent',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 10,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  iconBtn: {
    padding: 8,
  },
  title: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  statusBox: {
    alignSelf: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 10,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  frameContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  frame: {
    width: 280,
    height: 180,
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderColor: 'white',
  },
  topLeft: {
    top: 0,
    left: 0,
    borderTopWidth: 3,
    borderLeftWidth: 3,
  },
  topRight: {
    top: 0,
    right: 0,
    borderTopWidth: 3,
    borderRightWidth: 3,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 3,
    borderRightWidth: 3,
  },
  hintText: {
    color: 'white',
    marginTop: 20,
    fontSize: 16,
  },
  bottomBar: {
    alignItems: 'center',
    paddingTop: 20,
    backgroundColor: 'rgba(0,0,0,0.4)',
    gap: 12,
  },
  flipBtn: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  nativeScanBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111111',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 16,
    gap: 8,
  },
  nativeScanText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  text: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    margin: 10,
  },
  backBtn: {
    marginTop: 20,
  },
});
