// components/AppText.jsx
import React from 'react';
import { Text, StyleSheet } from 'react-native';
import PropTypes from 'prop-types'; // Opcional, para validación de tipos

type AppTextProps = {
  children: React.ReactNode;
  style?: object;
  bold?: boolean;
  center?: boolean;
  size?: 'small' | 'medium' | 'large' | 'xlarge' | 'title';
  color?: 'default' | 'light' | 'white' | 'primary' | 'danger';
  [key: string]: any;
};

const AppText: React.FC<AppTextProps> = ({ 
  children, 
  style, 
  bold = false, 
  center = false, 
  size = 'medium',
  color = 'default',
  ...otherProps 
}) => {
  // Determinar el tamaño del texto
  const fontSize = {
    small: 14,
    medium: 16,
    large: 18,
    xlarge: 24,
    title: 28,
  }[size] || 16;

  // Determinar el color del texto
  const textColor = {
    default: '#333',
    light: '#666',
    white: '#fff',
    primary: '#4caf50',
    danger: '#e57373',
  }[color] || '#333';

  return (
    <Text 
      style={[
        styles.text, 
        { fontSize },
        { color: textColor },
        bold && styles.bold,
        center && styles.center,
        style, // Permite sobrescribir estilos
      ]}
      {...otherProps}
    >
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  text: {
    fontFamily: 'System', // Puedes cambiar a la fuente que prefieras
    fontSize: 16,
    color: '#333',
  },
  bold: {
    fontWeight: 'bold',
  },
  center: {
    textAlign: 'center',
  },
});

// Opcional: Validación de tipos con PropTypes
AppText.propTypes = {
  children: PropTypes.node.isRequired,
  style: PropTypes.object,
  bold: PropTypes.bool,
  center: PropTypes.bool,
  size: PropTypes.oneOf(['small', 'medium', 'large', 'xlarge', 'title']),
  color: PropTypes.oneOf(['default', 'light', 'white', 'primary', 'danger']),
};

export default AppText;