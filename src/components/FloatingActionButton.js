import PropTypes from 'prop-types';
import React, {useEffect, useRef} from 'react';
import {View} from 'react-native';
import Animated, {Easing, interpolateColor, useAnimatedStyle, useSharedValue, withTiming} from 'react-native-reanimated';
import useLocalize from '@hooks/useLocalize';
import compose from '@libs/compose';
import styles from '@styles/styles';
import FabPlusIcon from './FabPlusIcon';
import PressableWithFeedback from './Pressable/PressableWithFeedback';
import Tooltip from './Tooltip/PopoverAnchorTooltip';
import withTheme, {withThemePropTypes} from './withTheme';
import withThemeStyles, {withThemeStylesPropTypes} from './withThemeStyles';

const AnimatedPressable = Animated.createAnimatedComponent(PressableWithFeedback);
AnimatedPressable.displayName = 'AnimatedPressable';

const propTypes = {
    /* Callback to fire on request to toggle the FloatingActionButton */
    onPress: PropTypes.func.isRequired,

    /* Current state (active or not active) of the component */
    isActive: PropTypes.bool.isRequired,

    /* An accessibility label for the button */
    accessibilityLabel: PropTypes.string.isRequired,

    /* An accessibility role for the button */
    accessibilityRole: PropTypes.string.isRequired,

    ...withThemeStylesPropTypes,
    ...withThemePropTypes,
};

const FloatingActionButton = React.forwardRef(({onPress, isActive, accessibilityLabel, accessibilityRole, theme, themeStyles}, ref) => {
    const {translate} = useLocalize();
    const fabPressable = useRef(null);
    const animatedValue = useSharedValue(isActive ? 1 : 0);
    const buttonRef = ref;

    useEffect(() => {
        animatedValue.value = withTiming(isActive ? 1 : 0, {
            duration: 340,
            easing: Easing.inOut(Easing.ease),
        });
    }, [isActive, animatedValue]);

    const animatedStyle = useAnimatedStyle(() => {
        const backgroundColor = interpolateColor(animatedValue.value, [0, 1], [theme.success, theme.buttonDefaultBG]);

        return {
            transform: [{rotate: `${animatedValue.value * 135}deg`}],
            backgroundColor,
            borderRadius: styles.floatingActionButton.borderRadius,
        };
    });

    return (
        <Tooltip text={translate('common.new')}>
            <View style={themeStyles.floatingActionButtonContainer}>
                <AnimatedPressable
                    ref={(el) => {
                        fabPressable.current = el;
                        if (buttonRef) {
                            buttonRef.current = el;
                        }
                    }}
                    accessibilityLabel={accessibilityLabel}
                    accessibilityRole={accessibilityRole}
                    pressDimmingValue={1}
                    onPress={(e) => {
                        // Drop focus to avoid blue focus ring.
                        fabPressable.current.blur();
                        onPress(e);
                    }}
                    onLongPress={() => {}}
                    style={[themeStyles.floatingActionButton, animatedStyle]}
                >
                    <FabPlusIcon isActive={isActive} />
                </AnimatedPressable>
            </View>
        </Tooltip>
    );
});

FloatingActionButton.propTypes = propTypes;
FloatingActionButton.displayName = 'FloatingActionButton';

export default compose(withThemeStyles, withTheme)(FloatingActionButton);
