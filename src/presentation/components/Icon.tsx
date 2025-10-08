import { icons } from 'lucide-react-native';
import { FC } from 'react';

export type LucideIconName = keyof typeof icons;
// 1. Props'ların tiplerini tanımlıyoruz.
// Bu, bileşenin hangi parametreleri ne türde alacağını belirler.
type IconProps = {
  // 'name' prop'u, 'lucide-react-native' kütüphanesindeki
  // geçerli ikon isimlerinden biri olmak zorunda.
  name: LucideIconName;
  color: string;
  size: number;
};
const Icon: FC<IconProps> = ({ name, color, size }) => {
  const LucideIcon = icons[name];

  return <LucideIcon color={color} size={size} />;
};

export default Icon;