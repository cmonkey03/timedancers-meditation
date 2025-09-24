import { useThemeColors } from '@/hooks/use-theme';
import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';

const AnimatedWelcomeText = () => {
  const C = useThemeColors();
  const [titleText, setTitleText] = useState('');
  const [subtitleText, setSubtitleText] = useState('');
  const [showCursor1, setShowCursor1] = useState(false);
  const [showCursor2, setShowCursor2] = useState(false);
  
  const fullTitle = "Decolonize your destiny";
  const fullSubtitle = "Unlock the power of timedancing through meditating on three sacred centers";

  useEffect(() => {
    // Start typing title after tree begins growing
    const startTitle = setTimeout(() => {
      setShowCursor1(true);
      let i = 0;
      const titleInterval = setInterval(() => {
        if (i <= fullTitle.length) {
          setTitleText(fullTitle.slice(0, i));
          i++;
        } else {
          clearInterval(titleInterval);
          setShowCursor1(false);
          
          // Start subtitle after brief pause
          setTimeout(() => {
            setShowCursor2(true);
            let j = 0;
            const subtitleInterval = setInterval(() => {
              if (j <= fullSubtitle.length) {
                setSubtitleText(fullSubtitle.slice(0, j));
                j++;
              } else {
                clearInterval(subtitleInterval);
                setShowCursor2(false);
              }
            }, 40);
          }, 300);
        }
      }, 80);
    }, 800);

    return () => clearTimeout(startTitle);
  }, []);

  return (
    <View style={{ 
      alignItems: 'center', 
      paddingHorizontal: 32, 
      marginTop: 24,
    }}>
      <Text style={{
        fontSize: 24,
        fontWeight: '700',
        color: C.text,
        textAlign: 'center',
        marginBottom: 16,
        minHeight: 32, // Prevent layout shift
      }}>
        {titleText}
        {showCursor1 && <Text style={{ opacity: 0.5 }}>|</Text>}
      </Text>
      
      <Text style={{
        fontSize: 16,
        fontWeight: '400',
        color: C.text,
        opacity: 0.75,
        textAlign: 'center',
        minHeight: 24, // Prevent layout shift
      }}>
        {subtitleText}
        {showCursor2 && <Text style={{ opacity: 0.5 }}>|</Text>}
      </Text>
    </View>
  );
};

export default AnimatedWelcomeText;
