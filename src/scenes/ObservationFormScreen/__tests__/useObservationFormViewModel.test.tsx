import React from 'react';
import {renderHook, act} from '@testing-library/react-native';
import axios from 'axios';
import {NavigationContainer} from '@react-navigation/native';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {configureStore} from '@reduxjs/toolkit';
import {Provider} from 'react-redux';
import {useObservationFormViewModel} from '../useObservationFormViewModel';

const mockGoBack = jest.fn();
const mockPopToTop = jest.fn();
const mockNavigate = jest.fn();
const mockDispatch = jest.fn();
const mockDeleteMutate = jest.fn();
const mockCreateMutate = jest.fn();
const mockUpdateMutate = jest.fn();
const mockCreateClassMutate = jest.fn();

let mockRouteParams: {mode: 'create' | 'edit'; observationId?: string} = {
  mode: 'edit',
  observationId: 'obs-1',
};

let latestCreateClassOptions:
  | {
      onSuccess?: (newClass: {id: string; name: string; shift?: string}) => void;
      onQueued?: (queuedClass: {id: string; name: string; shift?: string}) => void;
      onError?: (error: unknown) => void;
    }
  | undefined;

let latestCreateOptions:
  | {
      onSuccess?: () => void;
      onError?: (error: unknown) => void;
    }
  | undefined;

let latestUpdateOptions:
  | {
      onSuccess?: () => void;
      onQueued?: () => void;
      onError?: (error: unknown) => void;
    }
  | undefined;

let latestDeleteOptions:
  | {
      onSuccess?: () => void;
      onError?: (error: unknown) => void;
    }
  | undefined;

const defaultObservation = {
  id: 'obs-1',
  student: 'Ana',
  className: '5º A',
  classId: 'class-1',
  text: 'Observação',
  favorite: false,
  createdAt: '2026-05-09T00:00:00.000Z',
  updatedAt: '2026-05-09T00:00:00.000Z',
};

const setCreateMode = () => {
  mockRouteParams = {mode: 'create'};
  useObservationsQuery.mockReturnValue({data: [], isLoading: false});
};

const fillRequiredFields = (result: ReturnType<typeof renderViewModel>['result']) => {
  act(() => {
    result.current.onChangeStudent('Marina');
    result.current.onChangeText('Participou bem da atividade.');
  });
};

const triggerCreateSave = (result: ReturnType<typeof renderViewModel>['result']) => {
  act(() => {
    result.current.onSave();
  });
};

const triggerDelete = (result: ReturnType<typeof renderViewModel>['result']) => {
  act(() => {
    result.current.onDelete?.();
  });
};

jest.mock('@react-navigation/native', () => {
  const actual = jest.requireActual('@react-navigation/native');
  return {
    ...actual,
    useNavigation: () => ({
      goBack: mockGoBack,
      popToTop: mockPopToTop,
      navigate: mockNavigate,
    }),
    useRoute: () => ({params: mockRouteParams}),
  };
});

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch,
}));

jest.mock('@hooks/useClasses', () => ({
  useClassesQuery: jest.fn(),
  useCreateClassMutation: jest.fn(),
}));

jest.mock('@hooks/useObservations', () => ({
  useObservationsQuery: jest.fn(),
  useCreateObservationMutation: jest.fn(),
  useUpdateObservationMutation: jest.fn(),
  useDeleteObservationMutation: jest.fn(),
}));

const mockBreadcrumb = jest.fn();
const mockLogError = jest.fn();
const mockLogEvent = jest.fn();

jest.mock('@services/monitoring', () => ({
  monitoring: {
    breadcrumb: (...args: unknown[]) => mockBreadcrumb(...args),
    logError: (...args: unknown[]) => mockLogError(...args),
    logEvent: (...args: unknown[]) => mockLogEvent(...args),
  },
  Events: {
    OBSERVATION_CREATED: 'OBSERVATION_CREATED',
    OBSERVATION_EDITED: 'OBSERVATION_EDITED',
    OBSERVATION_DELETED: 'OBSERVATION_DELETED',
  },
}));

jest.mock('@store/observations/slice', () => ({
  showObservationErrorToast: (message: string) => ({
    type: 'observations/showObservationErrorToast',
    payload: message,
  }),
}));

const {useClassesQuery, useCreateClassMutation} = jest.requireMock('@hooks/useClasses');
const {
  useObservationsQuery,
  useCreateObservationMutation,
  useUpdateObservationMutation,
  useDeleteObservationMutation,
} = jest.requireMock('@hooks/useObservations');

function renderViewModel() {
  const store = configureStore({
    reducer: () => ({}),
  });

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {retry: false, gcTime: Infinity},
      mutations: {retry: false, gcTime: Infinity},
    },
  });

  const wrapper = ({children}: {children: React.ReactNode}) => (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <NavigationContainer>{children}</NavigationContainer>
      </Provider>
    </QueryClientProvider>
  );

  return renderHook(useObservationFormViewModel, {wrapper});
}

describe('useObservationFormViewModel', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(axios, 'isAxiosError').mockReturnValue(false);
    mockRouteParams = {mode: 'edit', observationId: 'obs-1'};
    latestCreateClassOptions = undefined;
    latestCreateOptions = undefined;
    latestUpdateOptions = undefined;
    latestDeleteOptions = undefined;

    useClassesQuery.mockReturnValue({
      data: [{id: 'class-1', name: '5º A'}],
    });
    useCreateClassMutation.mockImplementation(
      (options: typeof latestCreateClassOptions) => {
        latestCreateClassOptions = options;
        return {
          isPending: false,
          mutate: mockCreateClassMutate,
        };
      },
    );
    useObservationsQuery.mockReturnValue({
      data: [defaultObservation],
      isLoading: false,
    });
    useCreateObservationMutation.mockImplementation(
      (options: typeof latestCreateOptions) => {
        latestCreateOptions = options;
        return {
          isPending: false,
          mutate: mockCreateMutate,
        };
      },
    );
    useUpdateObservationMutation.mockImplementation(
      (options: typeof latestUpdateOptions) => {
        latestUpdateOptions = options;
        return {
          isPending: false,
          mutate: mockUpdateMutate,
        };
      },
    );
    useDeleteObservationMutation.mockImplementation(
      (options: typeof latestDeleteOptions) => {
        latestDeleteOptions = options;
        return {
          isPending: false,
          mutate: mockDeleteMutate,
        };
      },
    );
  });

  it('should return to observations home after deleting', () => {
    const {result} = renderViewModel();

    act(() => {
      result.current.onDelete?.();
      latestDeleteOptions?.onSuccess?.();
    });

    expect(mockDeleteMutate).toHaveBeenCalledWith('obs-1');
    expect(mockPopToTop).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith('ObservationsHome');
  });

  it('should navigate back after creating a new observation successfully', () => {
    setCreateMode();

    const {result} = renderViewModel();

    fillRequiredFields(result);
    triggerCreateSave(result);

    act(() => {
      latestCreateOptions?.onSuccess?.();
    });

    expect(mockCreateMutate).toHaveBeenCalledWith(
      expect.objectContaining({
        student: 'Marina',
        className: '5º A',
        classId: 'class-1',
        text: 'Participou bem da atividade.',
        favorite: false,
      }),
    );
    expect(mockLogEvent).toHaveBeenCalledWith('OBSERVATION_CREATED');
    expect(mockBreadcrumb).toHaveBeenCalledWith('observation_created');
    expect(mockGoBack).toHaveBeenCalled();
  });

  it('should queue create offline and navigate back without dispatching an error', () => {
    setCreateMode();

    const {result} = renderViewModel();

    fillRequiredFields(result);
    triggerCreateSave(result);

    act(() => {
      jest.spyOn(axios, 'isAxiosError').mockReturnValue(true);
      latestCreateOptions?.onError?.({isAxiosError: true, response: undefined});
    });

    expect(mockBreadcrumb).toHaveBeenCalledWith('observation_created_offline');
    expect(mockGoBack).toHaveBeenCalled();
    expect(mockDispatch).not.toHaveBeenCalledWith(
      expect.objectContaining({type: 'observations/showObservationErrorToast'}),
    );
  });

  it('should dispatch an error toast when create fails online', () => {
    setCreateMode();

    const {result} = renderViewModel();

    fillRequiredFields(result);
    triggerCreateSave(result);

    act(() => {
      latestCreateOptions?.onError?.(new Error('server'));
    });

    expect(mockLogError).toHaveBeenCalledWith(expect.any(Error), {
      action: 'create_observation',
    });
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'observations/showObservationErrorToast',
      payload: 'Não foi possível criar a observação.',
    });
  });

  it('should update an existing observation with favorite and timestamp changes', () => {
    useObservationsQuery.mockReturnValue({
      data: [
        {
          ...defaultObservation,
          classId: undefined,
          text: 'Observação antiga',
        },
      ],
      isLoading: false,
    });

    const {result} = renderViewModel();

    act(() => {
      result.current.onToggleFavorite();
      result.current.onChangeText('Observação atualizada');
    });

    act(() => {
      result.current.onSave();
      latestUpdateOptions?.onSuccess?.();
    });

    expect(mockUpdateMutate).toHaveBeenCalledWith({
      id: 'obs-1',
      payload: expect.objectContaining({
        student: 'Ana',
        className: '5º A',
        favorite: true,
        text: 'Observação atualizada',
      }),
    });
    expect(mockLogEvent).toHaveBeenCalledWith('OBSERVATION_EDITED');
    expect(mockBreadcrumb).toHaveBeenCalledWith('observation_edited');
    expect(mockGoBack).toHaveBeenCalled();
  });

  it('should dispatch an error toast when update fails', () => {
    const {result} = renderViewModel();

    act(() => {
      result.current.onSave();
      latestUpdateOptions?.onError?.(new Error('update failed'));
    });

    expect(mockLogError).toHaveBeenCalledWith(expect.any(Error), {
      action: 'edit_observation',
    });
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'observations/showObservationErrorToast',
      payload: 'Não foi possível atualizar a observação.',
    });
  });

  it('should queue observation update offline and navigate back', () => {
    const {result} = renderViewModel();

    act(() => {
      result.current.onChangeText('Observação offline');
      result.current.onSave();
      latestUpdateOptions?.onQueued?.();
    });

    expect(mockBreadcrumb).toHaveBeenCalledWith('observation_updated_offline');
    expect(mockGoBack).toHaveBeenCalled();
  });

  it('should expose route loading and resolve class id from class name fallback', () => {
    useClassesQuery.mockReturnValue({
      data: [{id: 'class-1', name: '5º A'}],
    });
    useObservationsQuery.mockReturnValue({
      data: [{...defaultObservation, classId: undefined}],
      isLoading: true,
    });

    const {result} = renderViewModel();

    expect(result.current.classId).toBe('class-1');
    expect(result.current.className).toBe('5º A');
    expect(result.current.isRouteLoading).toBe(true);
  });

  it('should fall back to the first class when creating a new observation', () => {
    setCreateMode();
    useClassesQuery.mockReturnValue({
      data: [
        {id: 'class-1', name: '5º A'},
        {id: 'class-2', name: '6º B'},
      ],
    });

    const {result} = renderViewModel();

    expect(result.current.classId).toBe('class-1');
    expect(result.current.className).toBe('5º A');
  });

  it('should not save while required fields are invalid', () => {
    setCreateMode();

    const {result} = renderViewModel();

    act(() => {
      result.current.onChangeStudent('   ');
      result.current.onChangeText('   ');
      result.current.onSave();
    });

    expect(result.current.canSave).toBe(false);
    expect(mockCreateMutate).not.toHaveBeenCalled();
    expect(mockUpdateMutate).not.toHaveBeenCalled();
  });

  it('should select the newly created class on createClass success', () => {
    setCreateMode();

    const {result} = renderViewModel();

    act(() => {
      result.current.onCreateClass('Nova turma', 'Tarde');
    });

    expect(mockCreateClassMutate).toHaveBeenCalledWith({name: 'Nova turma', shift: 'Tarde'});

    act(() => {
      latestCreateClassOptions?.onSuccess?.({
        id: 'class-9',
        name: 'Nova turma',
        shift: 'Tarde',
      });
    });

    expect(result.current.classId).toBe('class-9');
  });

  it('should select the queued class id when class creation happens offline', () => {
    setCreateMode();

    const {result} = renderViewModel();

    act(() => {
      result.current.onCreateClass('Nova turma offline', 'Tarde');
      latestCreateClassOptions?.onQueued?.({
        id: 'temp-class-9',
        name: 'Nova turma offline',
        shift: 'Tarde',
      });
    });

    expect(result.current.classId).toBe('temp-class-9');
    expect(mockBreadcrumb).toHaveBeenCalledWith('class_created_offline');
  });

  it('should log create class errors', () => {
    const {result} = renderViewModel();

    act(() => {
      result.current.onCreateClass('Nova turma', 'Tarde');
      latestCreateClassOptions?.onError?.(new Error('create class failed'));
    });

    expect(mockLogError).toHaveBeenCalledWith(expect.any(Error), {
      action: 'create_class',
    });
  });

  it('should also return to observations home when delete is queued offline', () => {
    const {result} = renderViewModel();

    triggerDelete(result);

    act(() => {
      jest.spyOn(axios, 'isAxiosError').mockReturnValue(true);
      latestDeleteOptions?.onError?.({isAxiosError: true, response: undefined});
    });

    expect(mockPopToTop).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith('ObservationsHome');
  });

  it('should dispatch an error toast when delete fails online', () => {
    const {result} = renderViewModel();

    triggerDelete(result);

    act(() => {
      latestDeleteOptions?.onError?.(new Error('delete failed'));
    });

    expect(mockLogError).toHaveBeenCalledWith(expect.any(Error), {
      action: 'delete_observation_form',
    });
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'observations/showObservationErrorToast',
      payload: 'Não foi possível apagar a observação.',
    });
  });

  it('should create a class and auto-select it after success', () => {
    const {result} = renderViewModel();

    act(() => {
      result.current.onCreateClass('7º B', 'Tarde');
      latestCreateClassOptions?.onSuccess?.({
        id: 'class-2',
        name: '7º B',
        shift: 'Tarde',
      });
    });

    expect(mockCreateClassMutate).toHaveBeenCalledWith({
      name: '7º B',
      shift: 'Tarde',
    });
    expect(result.current.classId).toBe('class-2');
  });

  it('should log class creation errors', () => {
    const {result} = renderViewModel();

    act(() => {
      result.current.onCreateClass('7º B', 'Tarde');
      latestCreateClassOptions?.onError?.(new Error('class failed'));
    });

    expect(mockLogError).toHaveBeenCalledWith(expect.any(Error), {
      action: 'create_class',
    });
  });

  it('should expose canSave as false when required fields are missing', () => {
    useObservationsQuery.mockReturnValue({
      data: [
        {
          id: 'obs-1',
          student: '   ',
          className: '5º A',
          classId: 'class-1',
          text: '   ',
          favorite: false,
          createdAt: '2026-05-09T00:00:00.000Z',
          updatedAt: '2026-05-09T00:00:00.000Z',
        },
      ],
      isLoading: false,
    });

    const {result} = renderViewModel();

    expect(result.current.canSave).toBe(false);

    act(() => {
      result.current.onSave();
    });

    expect(mockCreateMutate).not.toHaveBeenCalled();
    expect(mockUpdateMutate).not.toHaveBeenCalled();
  });

  it('should expose canSave as true when required fields are filled', () => {
    const {result} = renderViewModel();

    expect(result.current.canSave).toBe(true);
  });

  it('should expose create mode without delete action and support back/select handlers', () => {
    mockRouteParams = {mode: 'create'};
    useObservationsQuery.mockReturnValue({data: [], isLoading: false});

    const {result} = renderViewModel();

    expect(result.current.onDelete).toBeUndefined();

    act(() => {
      result.current.onSelectClass('class-1');
      result.current.onBackPress();
    });

    expect(result.current.classId).toBe('class-1');
    expect(mockGoBack).toHaveBeenCalled();
  });
});
