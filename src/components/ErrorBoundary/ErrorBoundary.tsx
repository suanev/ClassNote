import React from 'react';

import {monitoring} from '@services/monitoring';
import {
  ErrorContainer,
  ErrorDescription,
  ErrorTitle,
  RetryButton,
  RetryButtonLabel,
} from './styles';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends React.Component<Props, State> {
  state: State = {hasError: false};

  static getDerivedStateFromError(): State {
    return {hasError: true};
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    monitoring.logError(error, {component_stack: info.componentStack?.slice(0, 200) ?? ''});
  }

  render() {
    if (this.state.hasError) {
      return (
        <ErrorContainer>
          <ErrorTitle>Algo deu errado</ErrorTitle>
          <ErrorDescription>
            Um erro inesperado ocorreu. Por favor, reinicie o aplicativo.
          </ErrorDescription>
          <RetryButton onPress={() => this.setState({hasError: false})}>
            <RetryButtonLabel>Tentar novamente</RetryButtonLabel>
          </RetryButton>
        </ErrorContainer>
      );
    }
    return this.props.children;
  }
}
