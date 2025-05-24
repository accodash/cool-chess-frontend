import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Social from './Social';
import { useCurrentUser } from '../hooks/useCurrentUser';
import { useNavigate, useLocation } from 'react-router-dom';

jest.mock('../hooks/useCurrentUser', () => ({
    useCurrentUser: jest.fn(),
}));

jest.mock('../components/misc/PageHeader', () => (props: any) => <div data-testid="page-header">{props.title}</div>);

jest.mock('react-router-dom', () => {
    const actual = jest.requireActual('react-router-dom');
    return {
        ...actual,
        useNavigate: jest.fn(),
        useLocation: jest.fn(),
        Outlet: () => <div data-testid="outlet">Outlet</div>,
    };
});

describe('Social', () => {
    const mockNavigate = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
    });

    const renderWithPath = (pathname: string, user: any = { uuid: 'abc' }) => {
        (useLocation as jest.Mock).mockReturnValue({ pathname });
        (useCurrentUser as jest.Mock).mockReturnValue({ data: user });
        return render(<Social />);
    };

    it('renders title and outlet always', () => {
        renderWithPath('/social/unknown', null);
        expect(screen.getByTestId('page-header')).toHaveTextContent('Social');
        expect(screen.getByTestId('outlet')).toBeInTheDocument();
    });

    it('does not render Tabs if currentUser is null', () => {
        renderWithPath('/social/friends', null);
        expect(screen.queryByRole('tab')).not.toBeInTheDocument();
    });

    it.each([
        ['/social/friends', 0],
        ['/social/sent-requests', 1],
        ['/social/received-requests', 2],
        ['/social/all-users', 3],
    ])('renders correct tab for path %s', (path, expectedIndex) => {
        renderWithPath(path);
        const tabs = screen.getAllByRole('tab');
        expect(tabs.length).toBe(4);
        expect(tabs[expectedIndex]).toHaveAttribute('aria-selected', 'true');
    });

    it('falls back to first tab when path doesn’t match', () => {
        renderWithPath('/social/unknown-path');
        const tabs = screen.getAllByRole('tab');
        expect(tabs[0]).toHaveAttribute('aria-selected', 'true');
    });

    it('calls navigate when tab is changed', () => {
        renderWithPath('/social/friends');
        const tabs = screen.getAllByRole('tab');
        fireEvent.click(tabs[2]);
        expect(mockNavigate).toHaveBeenCalledWith('/social/received-requests');
    });
});
