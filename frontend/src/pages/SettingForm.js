import * as React from 'react';
import { useLocation } from 'react-router-dom';
import ChangePasswordForm from '../components/ChangePasswordForm';

function SettingForm(props) {
    const location = useLocation();
    const settingTemplate = {
        'changePassword': (<ChangePasswordForm open={props.open}></ChangePasswordForm>)
    }
    return (
        <div>
            {settingTemplate[location.state.type]}
        </div>

    );
}

export default React.memo(SettingForm);