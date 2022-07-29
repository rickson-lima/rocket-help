import { Text, Button, IButtonProps, useTheme } from 'native-base';

type Props = IButtonProps & {
  title: string;
  type: 'status' | 'user';
  value: 'open' | 'closed' | 'all' | 'current';
  isActive?: boolean;
};

export function Filter({ isActive = false, title, value, type, ...rest }: Props) {
  const { colors } = useTheme();

  const colorType =
    type === 'user'
      ? colors.primary[700]
      : value === 'open'
      ? colors.secondary[700]
      : colors.green[300];

  return (
    <Button
      variant="outline"
      borderWidth={isActive ? 1 : 0}
      borderColor={colorType}
      bgColor="gray.600"
      flex={1}
      size="sm"
      {...rest}
    >
      <Text color={isActive ? colorType : 'gray.300'} fontSize="xs" textTransform="uppercase">
        {title}
      </Text>
    </Button>
  );
}
