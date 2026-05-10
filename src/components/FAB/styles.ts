import styled from 'styled-components/native';

interface FabContainerProps {
  $right: number;
  $bottom: number;
}

export const FabContainer = styled.View<FabContainerProps>`
  position: absolute;
  right: ${({$right}) => $right}px;
  bottom: ${({$bottom}) => $bottom}px;
`;

export const FabButton = styled.Pressable`
  width: 60px;
  height: 60px;
  border-radius: ${({theme}) => theme.radii.fab}px;
  align-items: center;
  justify-content: center;
  background-color: ${({theme}) => theme.colors.primary};
`;
