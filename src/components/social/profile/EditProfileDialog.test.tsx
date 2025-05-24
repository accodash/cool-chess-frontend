import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import EditProfileDialog from './EditProfileDialog';
import { useUpdateCurrentUser } from '../../../hooks/useUpdateCurrentUser';
import { useUploadAvatar } from '../../../hooks/useUploadAvatar';
import { User } from '../../../api/users';

jest.mock('../../../hooks/useUpdateCurrentUser', () => ({
    useUpdateCurrentUser: jest.fn(),
}));

jest.mock('../../../hooks/useUploadAvatar', () => ({
    useUploadAvatar: jest.fn(),
}));

const mockUpdate = jest.fn();
const mockUpload = jest.fn();

beforeEach(() => {
    (useUpdateCurrentUser as jest.Mock).mockReturnValue({
        mutateAsync: mockUpdate,
        isPending: false,
    });

    (useUploadAvatar as jest.Mock).mockReturnValue({
        mutateAsync: mockUpload,
        isPending: false,
    });
    mockUpdate.mockReset();
    mockUpload.mockReset();
});

const user: User = {
    uuid: 'user-1',
    username: 'ChessMaster',
    imageUrl: 'https://example.com/avatar.jpg',
    createdAt: '',
};

const setup = (props = {}) => render(<EditProfileDialog open={true} onClose={jest.fn()} user={user} {...props} />);

beforeAll(() => {
    Object.defineProperty(global.URL, 'createObjectURL', {
        writable: true,
        value: jest.fn(() => 'blob:mocked-url'),
    });

    Object.defineProperty(window, 'location', {
        writable: true,
        value: {
            reload: jest.fn(),
        },
    });
});

describe('EditProfileDialog', () => {
    it('renders with initial user data', () => {
        setup();
        expect(screen.getByDisplayValue('ChessMaster')).toBeInTheDocument();
        expect(screen.getByRole('img')).toHaveAttribute('src', user.imageUrl);
    });

    it('allows username editing', () => {
        setup();
        const input = screen.getByLabelText(/username/i);
        fireEvent.change(input, { target: { value: 'NewName' } });
        expect(input).toHaveValue('NewName');
    });

    it('opens file selector and updates avatar preview when a file is selected', () => {
        setup();
        const fileInput = screen.getByTestId('hidden-file-input') as HTMLInputElement;
        const uploadButton = screen.getByRole('button', { name: /upload avatar/i });

        fireEvent.click(uploadButton);

        const file = new File(['dummy content'], 'avatar.png', { type: 'image/png' });

        fireEvent.change(fileInput, {
            target: { files: [file] },
        });

        expect(fileInput.files?.[0]).toStrictEqual(file);
        expect(screen.getByRole('img')).toHaveAttribute('src', expect.stringContaining('blob:'));
    });

    it('calls updateMutation on save', async () => {
        mockUpload.mockResolvedValue('https://uploaded-image.com/new.png');
        mockUpdate.mockResolvedValue({});

        const onClose = jest.fn();
        setup({ onClose });

        const file = new File(['avatar'], 'avatar.png', { type: 'image/png' });
        const input = document.querySelector('input[type="file"]')!;
        fireEvent.change(input, { target: { files: [file] } });

        const saveButton = screen.getByRole('button', { name: /save/i });
        fireEvent.click(saveButton);

        await waitFor(() => {
            expect(mockUpload).toHaveBeenCalledWith(file);
            expect(mockUpdate).toHaveBeenCalledWith({
                username: 'ChessMaster',
                imageUrl: 'https://uploaded-image.com/new.png',
            });
            expect(onClose).toHaveBeenCalled();
        });
    });

    it('disables save button when mutation is pending', () => {
        (useUpdateCurrentUser as jest.Mock).mockReturnValue({
            mutateAsync: mockUpdate,
            isPending: true,
        });
        (useUploadAvatar as jest.Mock).mockReturnValue({
            mutateAsync: mockUpload,
            isPending: false,
        });

        setup();

        const saveButton = screen.getByRole('button', { name: '' });
        expect(saveButton).toBeDisabled();
    });

    it('calls onClose when cancel is clicked', () => {
        const onClose = jest.fn();
        setup({ onClose });

        const cancelButton = screen.getByRole('button', { name: /cancel/i });
        fireEvent.click(cancelButton);
        expect(onClose).toHaveBeenCalled();
    });

    it('logs error to console if upload fails', async () => {
        const error = new Error('Update failed!');
        mockUpload.mockRejectedValue(error);
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

        const onClose = jest.fn();
        setup({ onClose });

        const fileInput = screen.getByTestId('hidden-file-input') as HTMLInputElement;
        const file = new File(['dummy content'], 'avatar.png', { type: 'image/png' });
        fireEvent.change(fileInput, { target: { files: [file] } });

        const saveButton = screen.getByRole('button', { name: /save/i });
        fireEvent.click(saveButton);

        await waitFor(() => {
            expect(consoleErrorSpy).toHaveBeenCalledWith('Update failed:', error);
        });

        consoleErrorSpy.mockRestore();
    });

    it('logs error to console if update fails', async () => {
        const error = new Error('Update failed!');
        mockUpdate.mockRejectedValue(error);
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

        const onClose = jest.fn();
        setup({ onClose });

        const saveButton = screen.getByRole('button', { name: /save/i });
        fireEvent.click(saveButton);

        await waitFor(() => {
            expect(consoleErrorSpy).toHaveBeenCalledWith('Update failed:', error);
        });

        consoleErrorSpy.mockRestore();
    });

    it('opens file selector and updates avatar preview when a file is selected', () => {
        setup();
        const fileInput = screen.getByTestId('hidden-file-input') as HTMLInputElement;

        const file = new File(['dummy content'], 'avatar.png', { type: 'image/png' });

        fireEvent.change(fileInput, {
            target: { files: [file] },
        });

        expect(fileInput.files?.[0]).toStrictEqual(file);
        expect(screen.getByRole('img')).toHaveAttribute('src', expect.stringContaining('blob:'));
    });

    it('does not update state when files is null', () => {
        setup();

        const fileInput = screen.getByTestId('hidden-file-input') as HTMLInputElement;

        fireEvent.change(fileInput, {
            target: { files: null },
        });

        const avatar = screen.getByAltText('avatar');
        expect(avatar).toHaveAttribute('src', user.imageUrl);

        expect(fileInput.files).toBeNull();
    });

    it('renders Avatar with src when avatarPreview is set', () => {
        setup();
        const avatar = screen.getByAltText('avatar');
        expect(avatar).toHaveAttribute('src', 'https://example.com/avatar.jpg');
    });

    it('does not render Avatar without src and shows Person icon when avatarPreview is null', () => {
        const userNoAvatar = { ...user, imageUrl: null };
        render(<EditProfileDialog open={true} onClose={jest.fn()} user={userNoAvatar} />);

        expect(screen.queryByRole('img')).not.toBeInTheDocument();

        expect(screen.getByTestId('PersonIcon')).toBeInTheDocument();
    });

    it('clicking Upload Avatar button triggers file input click', () => {
        setup();

        const fileInput = screen.getByTestId('hidden-file-input') as HTMLInputElement;
        const clickSpy = jest.spyOn(fileInput, 'click');

        const uploadButton = screen.getByRole('button', { name: /upload avatar/i });
        fireEvent.click(uploadButton);

        expect(clickSpy).toHaveBeenCalled();

        clickSpy.mockRestore();
    });
});
