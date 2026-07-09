import { RegisterModal } from '../../components/auth/RegisterModal';
import { useNavigate } from 'react-router';

export default function Register() {
  const navigate = useNavigate();

  return <RegisterModal open onClose={() => navigate('/')} />;
}
