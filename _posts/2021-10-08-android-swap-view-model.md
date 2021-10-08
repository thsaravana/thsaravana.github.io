---
layout: post
title: "Swap ViewModel during testing in Android via Hilt"
---

I have seen a lot of ViewModel via Hilt examples where we hard code the actual implementation in the Activity or Fragment. May be, 
this is what you need, and you want to test your Fragments or Activities with the actual viewModel. But if you are like me, and you 
have some use case where you want to inject a fake viewModel and test your Fragments or Activities, then this blog is for you.

### ViewModel setup
```kotlin
class ListViewModelImpl(
    private val savedStateHandle: SavedStateHandle
) : ListViewModel() {

    override val title: MutableLiveData<String> = MutableLiveData()

    override fun load() {
        val value: String? = savedStateHandle["load"]
        if (value == null) {
            savedStateHandle["load"] = "Actual Implementation"
        } else {
            savedStateHandle["load"] = "Actual Retained Data"
        }
        title.value = savedStateHandle["load"]
    }
}

class ListViewModelFactory(
    owner: SavedStateRegistryOwner,
    args: Bundle? = null
) : AbstractSavedStateViewModelFactory(owner, args) {
    override fun <T : ViewModel?> create(
        key: String,
        modelClass: Class<T>,
        handle: SavedStateHandle
    ): T {
        return ListViewModelImpl(handle) as T
    }
}

abstract class ListViewModel : ViewModel() {

    abstract fun load()
    abstract val title: LiveData<String>
}
```

1. Create an `abstract` class implementing `ViewModel` and make your actual implementation extend this abstract class.
2. Create a `ViewModelFactory` as always to define how to create your ViewModel.
3. In the above case, I have used `AbstractSavedStateViewModelFactory`, but you can use the normal one if you don't care about
the `SavedStateHandle`


### Hilt module
```kotlin
@Module
@InstallIn(FragmentComponent::class)
object ListDI {

    @ListFragmentQualifier
    @Provides
    fun provideFactory(fragment: Fragment): AbstractSavedStateViewModelFactory {
        return ListViewModelFactory(fragment, fragment.arguments)
    }
}

@Qualifier
annotation class ListFragmentQualifier
```

1. Create a Module with Fragment scope, since we will be injecting the ViewModel in a Fragment.
2. Have a `Provides` function to construct the `ViewModelFactory`.
3. Create a `Qualifier` and apply that to the `Provides` function.
4. I have created a `Qualifier` since you could have multiple Fragments with a ViewModel for each and all of them extends
`AbstractSavedStateViewModelFactory` and we need to match which factory goes to which fragment.


### Fragment setup
```kotlin
@AndroidEntryPoint
class ListFragment : Fragment() {
    
    @ListFragmentQualifier
    @Inject
    lateinit var factory: AbstractSavedStateViewModelFactory

    private val viewModel: ListViewModel by viewModels(
        factoryProducer = { factory }
    )

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        viewModel.title.observe(viewLifecycleOwner) {
            binding.textView.text = it
        }
        viewModel.load()
    }
}
```

1. Inject the `ViewModelFactory` with the right `Qualifier`.
2. Have a `viewModel` reference with type of the `abstract` class of the ViewModel and create it via the `factory`.
3. I have used the `by viewModels()` extension, but you could also use the `ViewModelProviders.of(....)`


### Inject fake ViewModel
```kotlin
@Module
@TestInstallIn(
    components = [FragmentComponent::class],
    replaces = [ListDI::class]
)
object FakeListDI {

    @ListFragmentQualifier
    @Provides
    fun provideFactory(fragment: Fragment): AbstractSavedStateViewModelFactory {
        return ViewModelFactory(fragment, fragment.arguments)
    }

    class ViewModelFactory(
        owner: SavedStateRegistryOwner,
        args: Bundle? = null
    ) :
        AbstractSavedStateViewModelFactory(owner, args) {
        override fun <T : ViewModel?> create(
            key: String,
            modelClass: Class<T>,
            handle: SavedStateHandle
        ): T {
            return FakeViewModel(handle) as T
        }
    }

    class FakeViewModel(
        private val savedStateHandle: SavedStateHandle,
    ) : ListViewModel() {

        override fun load() {
            val value: String? = savedStateHandle["load"]
            if (value == null) {
                savedStateHandle["load"] = "Fake implementation"
            } else {
                savedStateHandle["load"] = "Fake Retained data"
            }
            title.value = savedStateHandle["load"]
        }

        override val title: MutableLiveData<String> = MutableLiveData()
    }
}
```

1. In your test package (`androidTest` in my case), create a Fake module that provides a Fake ViewModelFactory which in turn
creates a Fake ViewModel.
2. Use `TestInstallIn` to replace the module.
3. Use the same `Qualifier` here as well.


### Fragment Test setup
```kotlin
@HiltAndroidTest
@RunWith(AndroidJUnit4::class)
class ListFragmentTest {

    @get:Rule
    var hiltRule = HiltAndroidRule(this)

    @Before
    fun init() {
        hiltRule.inject()
    }

    @Test
    fun testTitleText() {
        val scenario = launchFragmentInHiltContainer<ListFragment>()
        onView(withId(R.id.textView)).check(matches(withText("Fake implementation")))
    }
}
```

1. Your test class should use `HiltAndroidTest` and the `HiltAndroidRule`.
2. You have to use `launchFragmentInHiltContainer` because if your fragment is annotated with `AndroidEntryPoint` it should
be hosted by an activity that's annotated with `AndroidEntryPoint`. And the extension above takes care of that.
3. Of course, you do have to setup a few more things like:
   1. A `CustomTestRunner` class and configure that as the `testInstrumentationRunner` in your Gradle file
   2. You need to create a test Activity that's annotated with `AndroidEntryPoint`
4. Don't worry, the [github project linked below](https://github.com/thsaravana/android-hilt-playground/tree/blog-swap-view-model) 
has all these configured, and you can just copy-paste these.


### Working Project
For a working example, please refer to the [android-hilt-playground](https://github.com/thsaravana/android-hilt-playground/tree/blog-swap-view-model) 
android project (branch `blog-swap-view-model`). Stay safe and be crazy!
