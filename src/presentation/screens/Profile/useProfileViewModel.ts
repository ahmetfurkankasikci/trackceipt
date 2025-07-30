import { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { container } from 'tsyringe';
import { LogoutUseCase } from '../../../domain/usecases/LogoutUseCase';
import { setAuthError, setAuthLoading } from '../../../core/redux/slices/authSlice';
import { AppDispatch, AppRootState } from '../../../core/redux/store';


export const useProfileViewModel = () => {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: AppRootState) => state.auth.user);
  const logoutUseCase = useMemo(() => container.resolve(LogoutUseCase), []);

  const handleLogout = async () => {
    dispatch(setAuthLoading(true));
    try {
      await logoutUseCase.execute();
    } catch (error: any) {
      dispatch(setAuthError(error.message));
    }
  };

  return {
    user,
    handleLogout,
  };
};