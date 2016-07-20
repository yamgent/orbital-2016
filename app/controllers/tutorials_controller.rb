class TutorialsController < ApplicationController

  # The magic number for having no rank (if the user
  # selected the slot but did not rank them yet)
  NO_RANK = 999

  def view
  end

  def select
  end

  def select_save
    # process POST params
    pref = params[:preference_changes].split("_")
    pref.each do |tut_id|

      if tut_id == ""
        next
      end

      record = UserTutorialSelection.find_by(user_id: @current_user.id, tutorial_id: tut_id)
      # add record if not found
      if record == nil
        record = UserTutorialSelection.new(
          user_id: @current_user.id,
          tutorial_id: tut_id,
          rank: NO_RANK,
        )
        record.save
      else  # remove record if found
        record.destroy
      end
    end

    # TODO: Failure message (if applicable)
    redirect_to tutorials_rank_url
  end

  def rank
  end

  def rank_save
    # process POST params
    pref = params[:preferences].split("_")
    rank = 1

    pref.each do |selection_id|
        record = UserTutorialSelection.find_by(id: selection_id)

        # do validation to prevent modifying
        # records that doesn't belong to user!!!
        # (This is for security reason)
        if record.user_id == @current_user.id
            record.rank = rank
            record.save()
            rank += 1
        end
    end

    # TODO: Failure message (if applicable)
    redirect_to tutorials_view_url
  end

  # GET /tutorials
  def index
    # assume we are here for bidding, not for database management
    redirect_to tutorials_view_url
  end

  before_action :set_tutorial, only: [:edit, :update, :destroy]
  before_action :authorize_admin, only: [:new, :edit, :create, :update, :destroy]

  # GET /tutorials/new
  def new
    course_id = params[:course_id]
    if course_id.nil?
      course_id = Course.first.id
    end

    @edit_course = Course.find(course_id)
    @edit_tutorial = Tutorial.new
  end

  # GET /tutorials/edit/1
  def edit
    @edit_course = Course.find(@edit_tutorial.course_id)
  end

  # POST /tutorials
  def create
    @edit_tutorial = Tutorial.new(tutorial_params)
    @edit_course = Course.find(@edit_tutorial.course_id);

    respond_to do |format|
      if @edit_tutorial.save
        format.html { redirect_to @edit_course, notice: 'Tutorial was successfully created.' }
        format.json { render :show, status: :created, location: @edit_course }
      else
        format.html { render :new }
        format.json { render json: @edit_tutorial.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /tutorials/1
  def update
    @edit_course = Course.find(@edit_tutorial.course_id);

    respond_to do |format|
      if @edit_tutorial.update(tutorial_params)
        format.html { redirect_to @edit_course, notice: 'Tutorial was successfully updated.' }
        format.json { render :show, status: :ok, location: @edit_course }
      else
        format.html { render :edit }
        format.json { render json: @edit_tutorial.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /tutorials/1
  def destroy
    @edit_course = Course.find(@edit_tutorial.course_id);

    @edit_tutorial.destroy
    respond_to do |format|
      format.html { redirect_to @edit_course, notice: 'Tutorial was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_tutorial
      @edit_tutorial = Tutorial.find(params[:id])
    end

  private
    # Never trust parameters from the scary internet, only allow the white list through.
    def tutorial_params
      params.require(:tutorial).permit(:course_id, :day, :start_time, :end_time,
          :group_number, :odd_even, :has_second_tutorial, :second_day,
          :second_start_time, :second_end_time)
    end
end
