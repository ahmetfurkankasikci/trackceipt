import { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { container } from 'tsyringe';
import { LogoutUseCase } from '../../../domain/usecases/LogoutUseCase';
import { setAuthError, setAuthLoading } from '../../../core/redux/slices/authSlice';
import { AppDispatch, AppRootState } from '../../../core/redux/store';

/**
 * ProfileScreen için mantığı yöneten ViewModel kancası.
 */
export const useProfileViewModel = () => {
  const dispatch = useDispatch<AppDispatch>();
  // Redux store'dan mevcut kullanıcı bilgisini alıyoruz.
  const user = useSelector((state: AppRootState) => state.auth.user);
  const logoutUseCase = useMemo(() => container.resolve(LogoutUseCase), []);

  const handleLogout = async () => {
    dispatch(setAuthLoading(true));
    try {
      // LogoutUseCase'i çalıştırarak Firebase'den çıkış yapıyoruz.
      await logoutUseCase.execute();
      // Başarılı çıkış sonrası, AppNavigator'daki onAuthStateChanged dinleyicisi
      // Redux store'u otomatik olarak güncelleyecektir.
    } catch (error: any) {
      dispatch(setAuthError(error.message));
    }
  };

  return {
    user,
    handleLogout,
  };
};